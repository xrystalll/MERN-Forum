import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('GraphQL error: ', `Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }

  if (networkError) console.log('Network error: ', networkError)
})

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, splitLink]),
  cache: new InMemoryCache()
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
