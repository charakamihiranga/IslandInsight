import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Navbar from './components/Navbar';
import LatestNewsCard from './components/LatestNewsCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar/>
    <LatestNewsCard/>
    <App />
  </React.StrictMode>
);
