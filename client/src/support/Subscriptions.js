import gql from 'graphql-tag';

export const NEW_ANSWER = gql`
  subscription($threadId: ID!) {
    newAnswer(threadId: $threadId) {
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
      edited {
        createdAt
      }
      likes {
        id
        username
        picture
      }
      likeCount
      attach {
        file
        type
      }
    }
  }
`;

export const NEW_NOTIFICATION = gql`
  subscription($userId: ID!) {
    newNotification(userId: $userId) {
      id
      type
      to
      from {
        id
        username
        role
      }
      threadId
      title
      body
      createdAt
      read
    }
  }
`;
