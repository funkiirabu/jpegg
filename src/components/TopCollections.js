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

  const computePercentageChange = (current, previous) => ((current - previous) / previous) * 100;

  const renderChange = (current, previous) => {
    const percentageChange = computePercentageChange(current, previous);
    return (
      <span
        className={`inline-block ml-2 px-2 text-sm rounded 
                    ${percentageChange >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
      >
        {percentageChange.toFixed(2)}%
      </span>
    );
  }

  return (
    <table className="table-auto w-full mt-10">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Sales</th>
          <th>24h USD Volume</th>
          <th>24h Sui Volume</th>
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
            <td>
              {trendingCollection.current_trades_count}
              {/* Show the percentage change for trades count */}
              {renderChange(trendingCollection.current_trades_count, trendingCollection.previous_trades_count)}
            </td>
            <td>
              {/* Show the current USD volume, formatted as currency */}
              {formatCurrency(trendingCollection.current_usd_volume)}
              {/* Show the percentage change for USD volume */}
              {renderChange(trendingCollection.current_usd_volume, trendingCollection.previous_usd_volume)}
            </td>
            <td>
              {trendingCollection.current_volume}
              {/* Show the percentage change for volume */}
              {renderChange(trendingCollection.current_volume, trendingCollection.previous_volume)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TopCollections;
