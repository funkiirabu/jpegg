import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { render } from 'react-dom';
import { createApolloClient } from './apollo';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create an instance of ApolloClient
const apolloClient = createApolloClient();

// Wrap the rendering of the app with ApolloProvider
render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
