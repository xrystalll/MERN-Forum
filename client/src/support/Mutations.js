import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      createdAt
      token
      picture
      role
    }
  }
`;

export const REGISTER_USER = gql`
  mutation($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(
      registerInput: { username: $username, email: $email, password: $password, confirmPassword: $confirmPassword }
    ) {
      id
      username
      createdAt
      token
      picture
      role
    }
  }
`;

export const CREATE_THREAD = gql`
  mutation($boardId: ID!, $title: String!, $body: String!) {
    createThread(boardId: $boardId, title: $title, body: $body) {
      id
    }
  }
`;

export const CREATE_ANSWER = gql`
  mutation($threadId: ID!, $body: String!, $answeredTo: ID) {
    createAnswer(threadId: $threadId, body: $body, answeredTo: $answeredTo) {
      threadId
    }
  }
`;

export const LIKE_THREAD_MUTATION = gql`
  mutation($id: ID!) {
    likeThread(id: $id) {
      id
      likes {
        id
        username
        picture
      }
      likeCount
    }
  }
`;

export const LIKE_ANSWER_MUTATION = gql`
  mutation($id: ID!) {
    likeAnswer(id: $id) {
      id
      likes {
        id
        username
        picture
      }
      likeCount
    }
  }
`;

export const DELETE_THREAD = gql`
  mutation($id: ID!) {
    deleteThread(id: $id)
  }
`;

export const DELETE_ANSWER = gql`
  mutation($id: ID!) {
    deleteAnswer(id: $id)
  }
`;

export const ADMIN_EDIT_THREAD = gql`
  mutation($id: ID!, $title: String!, $body: String!, $pined: Boolean, $closed: Boolean) {
    adminEditThread(id: $id, title: $title, body: $body, pined: $pined, closed: $closed) {
      id
      pined
      closed
      title
      body
    }
  }
`;

export const USER_EDIT_THREAD = gql`
  mutation($id: ID!, $title: String!, $body: String!) {
    editThread(id: $id, title: $title, body: $body) {
      id
      title
      body
      edited {
        createdAt
      }
    }
  }
`;

export const EDIT_ANSWER = gql`
  mutation($id: ID!, $body: String!) {
    editAnswer(id: $id, body: $body) {
      id
      body
      edited {
        createdAt
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation($id: ID!, $onlineAt: String) {
    editUser(id: $id, onlineAt: $onlineAt) {
      id
      username
      onlineAt
    }
  }
`

export const UPLOAD_USER_PICTURE = gql`
  mutation($id: ID!, $file: Upload!) {
    uploadUserAvatar(id: $id, file: $file) {
      url
    }
  }
`;

export const DELETE_NOTIFICATIONS = gql`
  mutation($userId: ID!) {
    deleteNotifications(userId: $userId)
  }
`;

