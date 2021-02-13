import gql from 'graphql-tag';

export const NEW_ANSWER = gql`
  subscription {
    newAnswer {
      id
      threadId
      answeredTo
      body
      createdAt
      author {
        id
        username
        role
      }
    }
  }
`;
