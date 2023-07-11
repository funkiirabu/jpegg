import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './apollo';
// import FetchCollection from './components/FetchCollection'; // FetchCollection.js
import TopCollections from './components/TopCollections'; // TopCollections.js
import logo from './logo.svg';
import './App.css';

function App() {
  // Create an instance of ApolloClient
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <div className="text-center mt-20">
        <h1 className="text-5xl">Top Collections on Sui</h1>
        {/* <FetchCollection slug="0x71ef69d02e77dff830c7de41db1452928c8ecd9040a541eef6729f139df83ffd" /> */}
        <TopCollections />
      </div>
    </ApolloProvider>
  );
}

export default App;
