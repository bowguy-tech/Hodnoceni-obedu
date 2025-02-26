// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import RatingPage from './pages/RatingPage';
import AppRating from './pages/AppRating';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/rating/:id" element={<RatingPage />} />
        <Route path="/rate-app" element={<AppRating />} />
      </Routes>
    </Router>
  );
}

export default App;
