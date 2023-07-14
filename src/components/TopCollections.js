import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Dropdown from '../ui/Dropdown';
import Table from '../ui/Table';

const FETCH_TRENDING_COLLECTIONS = gql`
  query fetchTrendingCollections(
    $period: TrendingPeriod!
    $trending_by: TrendingBy!
    $offset: Int! = 0
    $limit: Int! = 50
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
  // State for the selected period and collection data
  const [period, setPeriod] = useState('days_1');
  const [collectionData, setCollectionData] = useState([]);

  // Fetch data using the GraphQL query
  const { loading, error, data } = useQuery(FETCH_TRENDING_COLLECTIONS, {
    variables: {
      period,
      trending_by: 'usd_volume',
      offset: 0,
      limit: 50,
    },
  });

  // Update collection data when data changes
  useEffect(() => {
    if (data && data.sui && data.sui.collections_trending) {
      setCollectionData(data.sui.collections_trending);
    }
  }, [data]);

  // Function to handle period change
  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
  };

  // Function to compute percentage change
  const computePercentageChange = (current, previous) => ((current - previous) / previous) * 100;

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(Math.floor(usdVolume));
  };

  // Function to render percentage change with appropriate styling
  const renderChange = (change, columnKey) => {
    if (columnKey === 'floor') {
      return null; // Skip rendering change for the floor column
    }

    if (!isFinite(change)) {
      return null;
    }

    const changeColor = change >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
    return (
      <span className={`inline-block ml-2 px-2 text-sm rounded ${changeColor}`}>
        {change.toFixed(2)}%
      </span>
    );
  };


  // Function to format the floor property
  const formatFloor = (floor) => {
    if (typeof floor !== 'number' || isNaN(floor)) {
      return ''; // Return an empty string or any other default value
    }

    if (floor >= 1000000000) {
      return `${(floor / 1000000000).toFixed(2)}`;
    } else if (floor >= 1000000) {
      return `${(floor / 1000000).toFixed(2)}`;
    } else if (floor >= 1000) {
      return `${(floor / 1000).toFixed(2)}`;
    } else {
      return floor.toFixed(0);
    }
  };

  // Prepare the data for the table rows
  const tableRows = collectionData.map((trendingCollection) => {
    const {
      id,
      collection,
      current_trades_count,
      current_usd_volume,
      current_volume,
      previous_trades_count,
      previous_usd_volume,
      previous_volume
    } = trendingCollection;

    // Calculate percentage change
    const tradesCountChange = computePercentageChange(
      current_trades_count,
      previous_trades_count
    );
    const usdVolumeChange = computePercentageChange(
      current_usd_volume,
      previous_usd_volume
    );
    const volumeChange = computePercentageChange(
      current_volume,
      previous_volume
    );
    const floorChange = computePercentageChange(
      collection.floor,
      previous_volume
    );

    return {
      id: id,
      cover_url: (
        <img className="w-20 h-20 object-cover" src={collection.cover_url} alt={collection.title} />
      ),
      title: collection.title,
      floor: (
        <>
          {formatFloor(collection.floor)}
          {renderChange(floorChange, 'floor')}
        </>
      ),
      verified: collection.verified ? 'Yes' : 'No',
      current_trades_count: (
        <>
          {current_trades_count}
          {renderChange(tradesCountChange, 'current_trades_count')}
        </>
      ),
      current_usd_volume: (
        <>
          {formatCurrentUSDVolume(current_usd_volume)}
          {renderChange(usdVolumeChange, 'current_usd_volume')}
        </>
      ),
      current_volume: (
        <>
          {formatCurrentVolume(current_volume)}
          {renderChange(volumeChange, 'current_volume')}
        </>
      ),
    };
  });

  // Define the column configuration for the table
  const tableColumns = [
    { key: 'cover_url', header: 'Cover', hideOnMobile: false },
    { key: 'title', header: 'Title', hideOnMobile: false },
    { key: 'floor', header: 'Floor', hideOnMobile: false },
    { key: 'current_trades_count', header: 'Sales', hideOnMobile: true },
    { key: 'current_usd_volume', header: 'USD Volume', hideOnMobile: true },
    { key: 'current_volume', header: 'Volume', hideOnMobile: false },
  ];

  // Loading state: Display a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Error state: Display an error message if there's an error fetching the data
  if (error) return <p>Error: {error.message}</p>;

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
