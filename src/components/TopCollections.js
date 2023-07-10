// src/components/TopCollections.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define your query
const FETCH_TOP_COLLECTIONS = gql`
  query fetchTopCollections($offset: Int, $limit: Int) {
    sui {
      collections(
        offset: $offset
        limit: $limit
        order_by: { usd_volume: desc }
      ) {
        id
        slug
        title
        supply
        cover_url
        floor
        usd_volume
        volume
        verified
      }
    }
  }
`;

// Create your component
const TopCollections = () => {
  // Make the query
  const { loading, error, data } = useQuery(FETCH_TOP_COLLECTIONS, {
    variables: { limit: 10 },
  });

  // Handle the different states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Once the data is loaded, map over it and display it
  return data.sui.collections.map((collection) => (
    <div key={collection.id}>
      <h2>{collection.title}</h2>
      <img src={collection.cover_url} alt={collection.title} className="w-64 h-64 object-cover" />
      <p>Supply: {collection.supply}</p>
      <p>USD Volume: {collection.usd_volume}</p>
      <p>Volume: {collection.volume}</p>
      <p>Floor: {collection.floor}</p>
      <p>Verified: {collection.verified ? 'Yes' : 'No'}</p>
    </div>
  ));
};

export default TopCollections;
