import React, { useState } from 'react';
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
  // State for the selected period
  const [period, setPeriod] = useState('days_1');

  // Fetch data using the GraphQL query
  const { loading, error, data } = useQuery(FETCH_TRENDING_COLLECTIONS, {
    variables: {
      period,
      trending_by: 'usd_volume',
      offset: 0,
      limit: 10
    }
  });

  // Function to handle period change
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // Loading state: Display a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Error state: Display an error message if there's an error fetching the data
  if (error) return <p>Error: {error.message}</p>;

  // Function to format a number as USD currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Function to compute percentage change
  const computePercentageChange = (current, previous) => ((current - previous) / previous) * 100;

  // Function to render percentage change with appropriate styling
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
  };

  return (
    <div>
      {/* Dropdown to select the period */}
      <label htmlFor="period" className="mr-2">
        Select Period:
      </label>
      <select
        id="period"
        value={period}
        onChange={handlePeriodChange}
        className="p-2 rounded"
      >
        <option value="days_1">1 Day</option>
        <option value="days_7">7 Days</option>
        <option value="days_14">14 Days</option>
        <option value="days_30">30 Days</option>
      </select>

      {/* Table to display the trending collections */}
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
          {/* Map over the trending collections and render each row */}
          {data.sui.collections_trending.map((trendingCollection) => (
            <tr key={trendingCollection.id}>
              <td>
                {/* Display the collection cover image */}
                <img
                  className="w-20 h-20 object-cover"
                  src={trendingCollection.collection.cover_url}
                  alt={trendingCollection.collection.title}
                />
              </td>
              <td>{trendingCollection.collection.title}</td>
              <td>
                {/* Display the current trades count */}
                {trendingCollection.current_trades_count}
                {/* Show the percentage change for trades count */}
                {renderChange(
                  trendingCollection.current_trades_count,
                  trendingCollection.previous_trades_count
                )}
              </td>
              <td>
                {/* Show the current USD volume, formatted as currency */}
                {formatCurrency(trendingCollection.current_usd_volume)}
                {/* Show the percentage change for USD volume */}
                {renderChange(
                  trendingCollection.current_usd_volume,
                  trendingCollection.previous_usd_volume
                )}
              </td>
              <td>
                {/* Display the current volume */}
                {trendingCollection.current_volume}
                {/* Show the percentage change for volume */}
                {renderChange(
                  trendingCollection.current_volume,
                  trendingCollection.previous_volume
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCollections;
