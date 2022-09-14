const express = require('express');
//import apollo server
const { ApolloServer }  = require('apollo-server-express');

//import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');

//import mongoose connection object
const db = require('./config/connection');
const { isConstValueNode } = require('graphql');

const PORT = process.env.PORT || 3001;
//create a new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create new instance of Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo server with the Express application middleware
  server.applyMiddleware({ app });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can test our GraphQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

//call the async function to start Apollo server
startApolloServer(typeDefs, resolvers);