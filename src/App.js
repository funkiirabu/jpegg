// App.js
import React from 'react';
import FetchCollection from './components/FetchCollection'; // FetchCollection.js
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <FetchCollection slug="0x71ef69d02e77dff830c7de41db1452928c8ecd9040a541eef6729f139df83ffd" />
    </div>
  );
}

export default App;
