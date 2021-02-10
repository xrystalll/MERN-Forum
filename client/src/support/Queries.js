import gql from 'graphql-tag';

export const BOARDS_AND_RECENTLY_THREADS_QUERY = gql`
  query($limit: Int) {
    getBoards {
      id
      title
      threadsCount
      answersCount
    }
    getRecentlyThreads(limit: $limit) {
      id
      boardId
      pined
      closed
      title
      createdAt
      author {
        id
        username
      }
      answersCount
    }
  }
`;

export const BOARDS_QUERY = gql`
  {
    getBoards {
      id
      title
      position
      threadsCount
      newestThread
      answersCount
    }
  }
`;

export const THREADS_QUERY = gql`
  query($boardId: ID!) {
    getThreads(boardId: $boardId) {
      id
      boardId
      pined
      closed
      title
      createdAt
      author {
        id
        username
      }
      likes {
        username
      }
      newestAnswer
      answersCount
    }
    getBoard(id: $boardId) {
      title
    }
  }
`;

export const THREAD_ANSWERS_QUERY = gql`
  query($id: ID!) {
    getThread(id: $id) {
      id
      boardTitle
      boardId
      pined
      closed
      title
      body
      createdAt
      author {
        id
        username
      }
      edited {
        createdAt
      }
      likes {
        username
      }
      likeCount
      attach {
        file
        type
      }
      answersCount
    }
    getAnswers(threadId: $id) {
      id
      threadId
      body
      createdAt
      author {
        id
        username
      }
      edited {
        createdAt
      }
      likes {
        username
      }
      likeCount
      attach {
        file
        type
      }
    }
  }
`;

export const USER_QUERY = gql`
  query($id: ID!) {
    getUser(id: $id) {
      id
      username
      createdAt
      onlineAt
      picture
      role
    }
  }
`;
