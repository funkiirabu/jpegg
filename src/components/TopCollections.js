// src/components/TopCollections.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

const TopCollections = () => {
  const { loading, error, data } = useQuery(FETCH_TOP_COLLECTIONS, {
    variables: { limit: 10 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <table className="table-auto w-full mt-10">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Supply</th>
          <th>USD Volume</th>
          <th>Volume</th>
          <th>Floor</th>
          <th>Verified</th>
        </tr>
      </thead>
      <tbody>
        {data.sui.collections.map((collection) => (
          <tr key={collection.id}>
            <td>
              <img
                className="w-20 h-20 object-cover"
                src={collection.cover_url}
                alt={collection.title}
              />
            </td>
            <td>{collection.title}</td>
            <td>{collection.supply}</td>
            <td>{collection.usd_volume}</td>
            <td>{collection.volume}</td>
            <td>{collection.floor}</td>
            <td>{collection.verified ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TopCollections;
