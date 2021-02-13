require('dotenv').config();

const path = require('path');

const http = require('http');
const express = require('express');
const cors = require('cors');

const { ApolloServer, PubSub } = require('apollo-server-express');

const DB = require('./models/index')

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub()

const app = express()

app.use(express.static(path.join(__dirname, '..', '/public')))
app.use(cors())

const server = new ApolloServer({
  subscriptions: {
    path: '/gql'
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
})

server.applyMiddleware({ app, path: '/gql' })

app.use((req, res) => {
  res.status(404)
  res.json({
    error: {
      status: 404,
      message: '404 Not Found'
    }
  })
})

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
const port = process.env.PORT || 8000;

DB().then(() => {
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server run on http://localhost:${port}/gql`)
  })
}).catch(console.error)
