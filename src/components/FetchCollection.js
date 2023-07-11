// src/components/FetchCollection.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import '../App.css';  // Make sure this is the correct path to your CSS file

// Define your query
const FETCH_COLLECTION_INFO = gql`
  query fetchCollectionInfo($slug: String!) {
    sui {
      collections(where: { slug: { _eq: $slug } }) {
        slug
        title
        cover_url
        supply
        verified
      }
    }
  }
`;

// Create your component
const FetchCollection = ({ slug }) => {
  // Make the query
  const { loading, error, data } = useQuery(FETCH_COLLECTION_INFO, {
    variables: { slug },
  });

  // Handle the different states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Once the data is loaded, map over it and display it
  return data.sui.collections.map((collection) => (
    <div key={collection.slug} className="flex flex-col items-center">
      <h2>{collection.title}</h2>
      <img
        src={collection.cover_url}
        alt={collection.title}
        className="w-64 h-64 object-cover"
      />
      <p>Supply: {collection.supply}</p>
      <p>Verified: {collection.verified ? 'Yes' : 'No'}</p>
    </div>
  ));  
};

export default FetchCollection;
