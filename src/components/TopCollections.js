import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Dropdown from '../ui/Dropdown';
import Table from '../ui/Table';

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
      limit: 10,
    },
  });

  // Function to handle period change
  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
  };

  // Loading state: Display a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Error state: Display an error message if there's an error fetching the data
  if (error) return <p>Error: {error.message}</p>;

  // Function to compute percentage change
  const computePercentageChange = (current, previous) => ((current - previous) / previous) * 100;

  // Function to render percentage change with appropriate styling
  const renderChange = (current, previous) => {
    const percentageChange = computePercentageChange(current, previous);
    const changeColor = percentageChange >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
    return (
      <span className={`inline-block ml-2 px-2 text-sm rounded ${changeColor}`}>
        {percentageChange.toFixed(2)}%
      </span>
    );
  };

  // Function to format the current_volume property
  const formatCurrentVolume = (volume) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}`;
    } else {
      return volume.toFixed(0);
    }
  };

  // Function to format the current_usd_volume property in USD currency format
  const formatCurrentUSDVolume = (usdVolume) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(
      Math.floor(usdVolume)
    );
  };

  // Define the column configuration for the table
  const tableColumns = [
    { key: 'cover_url', header: 'Cover' },
    { key: 'title', header: 'Title' },
    { key: 'current_trades_count', header: 'Sales' },
    { key: 'current_usd_volume', header: 'USD Volume' },
    { key: 'current_volume', header: 'Volume' },
  ];

  // Prepare the data for the table rows
  const tableRows = data.sui.collections_trending.map((trendingCollection) => ({
    id: trendingCollection.id,
    cover_url: (
      <img
        className="w-20 h-20 object-cover"
        src={trendingCollection.collection.cover_url}
        alt={trendingCollection.collection.title}
      />
    ),
    title: trendingCollection.collection.title,
    current_trades_count: (
      <>
        {trendingCollection.current_trades_count}
        {renderChange(trendingCollection.current_trades_count, trendingCollection.previous_trades_count)}
      </>
    ),
    current_usd_volume: (
      <>
        {formatCurrentUSDVolume(trendingCollection.current_usd_volume)}
        {renderChange(trendingCollection.current_usd_volume, trendingCollection.previous_usd_volume)}
      </>
    ),
    current_volume: (
      <>
        {formatCurrentVolume(trendingCollection.current_volume)}
        {renderChange(trendingCollection.current_volume, trendingCollection.previous_volume)}
      </>
    ),
  }));

  return (
    <div>
      {/* Dropdown to select the period */}
      <Dropdown
        value={period}
        onChange={handlePeriodChange}
        options={[
          { value: 'days_1', label: '1 Day' },
          { value: 'days_7', label: '7 Days' },
          { value: 'days_14', label: '14 Days' },
          { value: 'days_30', label: '30 Days' },
        ]}
      />

      {/* Table to display the trending collections */}
      <Table data={tableRows} columns={tableColumns} />
    </div>
  );
};

export default TopCollections;
