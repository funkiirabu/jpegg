// App.js
import React from 'react';
// import FetchCollection from './components/FetchCollection'; // FetchCollection.js
import TopCollections from './components/TopCollections'; // TopCollections.js
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl">Project Jpegg</h1>
      {/* <FetchCollection slug="0x71ef69d02e77dff830c7de41db1452928c8ecd9040a541eef6729f139df83ffd" /> */}
      <TopCollections />
    </div>
  );
}

export default App;
