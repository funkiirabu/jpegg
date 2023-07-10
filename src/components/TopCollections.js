// src/components/TopCollections.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FETCH_TRENDING_COLLECTIONS = gql`
  query fetchTrendingCollections(
    $period: TrendingPeriod!
    $trending_by: TrendingBy!
    $offset: Int! = 0
    $limit: Int! = 10
  ) {
    sui {
      collections_trending(
        period: $period
        trending_by: $trending_by
        offset: $offset
        limit: $limit
      ) {
        id: collection_id
        current_trades_count
        current_usd_volume
        current_volume
        previous_trades_count
        previous_usd_volume
        previous_volume
        collection {
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
  }
`;

const TopCollections = () => {
  const { loading, error, data } = useQuery(FETCH_TRENDING_COLLECTIONS, {
    variables: {
      period: "days_1",
      trending_by: "usd_volume",
      offset: 0,
      limit: 10
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Function to format number as USD currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <table className="table-auto w-full mt-10">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Current Trades Count</th>
          <th>Current USD Volume</th>
          <th>Current Volume</th>
          <th>Previous Trades Count</th>
          <th>Previous USD Volume</th>
          <th>Previous Volume</th>
        </tr>
      </thead>
      <tbody>
        {data.sui.collections_trending.map((trendingCollection) => (
          <tr key={trendingCollection.id}>
            <td>
              <img
                className="w-20 h-20 object-cover"
                src={trendingCollection.collection.cover_url}
                alt={trendingCollection.collection.title}
              />
            </td>
            <td>{trendingCollection.collection.title}</td>
            <td>{trendingCollection.current_trades_count}</td>
            <td>{formatCurrency(trendingCollection.current_usd_volume)}</td>
            <td>{trendingCollection.current_volume}</td>
            <td>{trendingCollection.previous_trades_count}</td>
            <td>{formatCurrency(trendingCollection.previous_usd_volume)}</td>
            <td>{trendingCollection.previous_volume}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TopCollections;
