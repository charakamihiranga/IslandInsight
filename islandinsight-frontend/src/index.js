import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Navbar from './components/Navbar';
import LatestNewsCard from './components/LatestNewsCard';
import NewsGrid from './components/newsGrid';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar/>
    <LatestNewsCard/>
    <NewsGrid/>
    <App />
  </React.StrictMode>
);
