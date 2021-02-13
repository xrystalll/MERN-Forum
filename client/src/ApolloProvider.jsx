import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from 'apollo-link-context';
import App from 'App';

const httpLink = createUploadLink({
  uri: 'http://localhost:8000/gql'
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8000/gql',
  options: {
    reconnect: true
  }
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem('token')
    headers = { ...headers, 'Authorization': token ? `Bearer ${token}` : '' }

    return { headers }
  })

  return forward(operation)
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: ApolloLink.from([authLink, splitLink]),
  cache: new InMemoryCache()
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
