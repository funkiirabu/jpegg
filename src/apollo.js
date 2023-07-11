import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const apiUrl = process.env.REACT_APP_INDEXER_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;
const apiUser = process.env.REACT_APP_API_USER;

// Create an http link:
const httpLink = createHttpLink({
  uri: apiUrl,
  headers: {
    'x-api-key': apiKey,
    'x-api-user': apiUser,
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});