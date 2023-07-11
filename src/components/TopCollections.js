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
  const [period, setPeriod] = useState('days_1');

  const { loading, error, data } = useQuery(FETCH_TRENDING_COLLECTIONS, {
    variables: {
      period,
      trending_by: 'usd_volume',
      offset: 0,
      limit: 10
    }
  });

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

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
  };

  return (
    <div>
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
      </select>

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
                {renderChange(
                  trendingCollection.current_trades_count,
                  trendingCollection.previous_trades_count
                )}
              </td>
              <td>
                {formatCurrency(trendingCollection.current_usd_volume)}
                {renderChange(
                  trendingCollection.current_usd_volume,
                  trendingCollection.previous_usd_volume
                )}
              </td>
              <td>
                {trendingCollection.current_volume}
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
