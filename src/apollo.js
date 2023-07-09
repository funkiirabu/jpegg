// src/apollo.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create an http link:
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_INDEXER_API_URL,
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
    'x-api-user': process.env.REACT_APP_API_USER,
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});