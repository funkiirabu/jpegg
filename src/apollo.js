import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

// Create an http link for SSR
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_INDEXER_API_URL,
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
    'x-api-user': process.env.REACT_APP_API_USER,
  }
});

// Create an instance of ApolloClient with the SSR link and cache
export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: true, // Enable SSR mode
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

