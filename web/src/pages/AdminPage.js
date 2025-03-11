import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import adminToken from "../hooks/useAdminToken";
import '../App.css';

function AdminPage() {
    adminToken();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([
    { id: 1, name: 'Kuřecí řízek', avgRating: 4.2 },
    { id: 2, name: 'Svíčková', avgRating: 4.5 },
    { id: 3, name: 'Guláš', avgRating: 3.8 },
  ]);
  const credentials = Cookies.get('authToken');

  return (
    <div className="container">
      <button
        onClick={() => navigate('/main')}
        style={{
          position: 'fixed', top: '20px', left: '20px', cursor: 'pointer',
          backgroundColor: '#007bff', color: '#fff', border: 'none',
          padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem'
        }}
      >
        Back
      </button>
      <header>
        <div className="logo">SPŠE Ječná</div>
        <h1 className="header-title">Admin - Přehled hodnocení jídel</h1>
      </header>

      <div className="rating-grid">
        {foodItems.length > 0 ? foodItems.map((item) => (
          <div key={item.id} className="rating-card">
            <h3>{item.name}</h3>
            <p>Průměrné hodnocení: <strong>{item.avgRating.toFixed(1)}</strong></p>
          </div>
        )) : <p>Načítání dat...</p>}
      </div>
    </div>
  );
}

export default AdminPage;
