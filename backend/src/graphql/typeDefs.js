const { gql } = require('apollo-server-express');

module.exports = gql`
  type Board {
    id: ID!
    title: String!
    body: String
    position: Int!
    createdAt: String!
    threadsCount: Int!
    newestThread: String!
    answersCount: Int!
  }
  type Thread {
    id: ID!
    boardId: ID!
    boardTitle: String!
    pined: Boolean!
    closed: Boolean!
    title: String!
    body: String!
    createdAt: String!
    author: Author!
    edited: Edited
    likes: [Like]!
    likeCount: Int!
    attach: [Attach]
    answersCount: Int!
    newestAnswer: String!
  }
  type Answer {
    id: ID!
    boardId: ID!
    threadId: ID!
    answeredTo: ID
    body: String!
    createdAt: String!
    author: Author!
    edited: Edited
    likes: [Like]!
    likeCount: Int!
    attach: [Attach]
  }
  type Notification {
    id: ID!
    type: String!
    to: ID!
    from: Author!
    threadId: ID!
    title: String!
    body: String!
    createdAt: String!
    read: Boolean!
  }

  type Author {
    id: ID!
    username: String!
    role: String!
  }
  type Edited {
    createdAt: String
  }
  type Like {
    id: ID!
    username: String!
    picture: String!
    createdAt: String!
  }
  type Attach {
    file: String!
    type: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    onlineAt: String!
    picture: String
    role: String
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type File {
    url: String!
  }

  type Query {
    getBoards(limit: Int, offset: Int): [Board]
    getBoard(id: ID!): Board

    getThreads(boardId: ID!, limit: Int, offset: Int): [Thread]
    getThread(id: ID!): Thread
    getRecentlyThreads(limit: Int, offset: Int): [Thread]

    getAnswers(threadId: ID!, limit: Int, offset: Int): [Answer]

    getUsers(limit: Int, offset: Int, sort: String): [User]
    getUser(id: ID!): User

    getNotifications(userId: ID!, limit: Int, offset: Int, sort: String): [Notification]
  }

  type Mutation {
    login(username: String!, password: String!): User!
    register(registerInput: RegisterInput): User!
    editUser(id: ID!, onlineAt: String): User!
    uploadUserAvatar(id: ID!, file: Upload!): File!

    createBoard(title: String!, body: String, position: Int!): Board!
    deleteBoard(id: ID!): String!
    editBoard(id: ID!, title: String!, body: String, position: Int): Board!

    createThread(boardId: ID!, title: String!, body: String!): Thread!
    deleteThread(id: ID!): String!
    editThread(id: ID!, title: String!, body: String!): Thread!
    adminEditThread(id: ID!, title: String!, body: String!, pined: Boolean, closed: Boolean): Thread!
    likeThread(id: ID!): Thread!

    createAnswer(threadId: ID!, answeredTo: ID, body: String!): Answer!
    deleteAnswer(id: ID!): String!
    editAnswer(id: ID!, body: String!): Answer!
    likeAnswer(id: ID!): Answer!

    deleteNotifications(userId: ID!): String!
  }

  type Subscription {
    newAnswer: Answer!
    newNotification: Notification!
  }
`;
