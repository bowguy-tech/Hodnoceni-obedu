import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../App.css';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { useNavigate, useParams } from 'react-router-dom';

function RatingPage() {
  useAuthRedirect();
  const navigate = useNavigate();
  const { id } = useParams();
  const [mealName, setMealName] = useState(sessionStorage.getItem(`mealName_${id}`) || 'Načítání...');
  const [base64, setBase64] = useState(sessionStorage.getItem(`base64_${id}`) || '');
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState(() => {
    return {
      portionSize: sessionStorage.getItem(`rating_${id}_portionSize`) || '',
      foodTemperature: sessionStorage.getItem(`rating_${id}_foodTemperature`) || '2',
      willingToPay: sessionStorage.getItem(`rating_${id}_willingToPay`) || '',
      foodAppearance: sessionStorage.getItem(`rating_${id}_foodAppearance`) || ''
    };
  });

  const credentials = Cookies.get('authToken');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        setBase64(base64String);
        sessionStorage.setItem(`base64_${id}`, base64String);
      };
      reader.onerror = (error) => {
        console.error('Error converting image to Base64', error);
      };
    }
  };

  useEffect(() => {
    if (!credentials) {
      console.error('Auth token missing!');
      setMealName('Chyba: Nepřihlášený uživatel');
      sessionStorage.setItem(`mealName_${id}`, 'Chyba: Nepřihlášený uživatel');
      return;
    }

    fetch(`http://localhost:3001/item?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': credentials,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const meal = data?.[0]?.Name || 'Neznámé jídlo';
        setMealName(meal);
        sessionStorage.setItem(`mealName_${id}`, meal);
      })
      .catch(error => {
        console.error('Chyba při načítání jídla:', error);
        setMealName('Chyba při načítání');
        sessionStorage.setItem(`mealName_${id}`, 'Chyba při načítání');
      });
  }, [id, credentials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      sessionStorage.setItem(`rating_${id}_${name}`, value);
      return updatedData;
    });
  };

  const handleSubmit = () => {
    setSending(true);
    const ratingData = {
      itemId: Number(id),
      portionSize: Number(formData.portionSize),
      foodTemperature: Number(formData.foodTemperature),
      willingToPay: Number(formData.willingToPay),
      foodAppearance: Number(formData.foodAppearance),
      image: base64,
    };

    fetch('http://localhost:3001/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': credentials,
      },
      body: JSON.stringify(ratingData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        sessionStorage.removeItem(`rating_${id}_portionSize`);
        sessionStorage.removeItem(`rating_${id}_foodTemperature`);
        sessionStorage.removeItem(`rating_${id}_willingToPay`);
        sessionStorage.removeItem(`rating_${id}_foodAppearance`);
        sessionStorage.removeItem(`base64_${id}`);
        sessionStorage.removeItem(`mealName_${id}`);
        navigate('/main');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Chyba při odesílání hodnocení');
        setSending(false);
      });
  };

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
        <h1 className="header-title">Hodnocení oběda</h1>
      </header>

      <div className="meal-info">
        <h2 className="meal-title">{mealName}</h2>
        <p className="meal-description">Ochutnej dnešní oběd a ohodnoť!</p>
      </div>

      <div className="rating-grid">
        <div className="rating-card">
          <div className="rating-icon">🍽</div>
          <h3>Porce jídla</h3>
          <select id="porce" name="portionSize" value={formData.portionSize} onChange={handleChange}>
            <option value="">Vyberte</option>
            <option value="5">Výborná</option>
            <option value="4">Dobrá</option>
            <option value="3">Průměrná</option>
            <option value="2">Špatná</option>
            <option value="1">Velmi špatná</option>
          </select>
        </div>

        <div className="rating-card">
          <div className="rating-icon">🌡</div>
          <h3>Teplota jídla</h3>
          <select id="teplota" name="foodTemperature" value={formData.foodTemperature} onChange={handleChange}>
            <option value="1">Moc studené</option>
            <option value="2">Ideální teplota</option>
            <option value="3">Moc teplé</option>
          </select>
        </div>

        <div className="rating-card">
          <div className="rating-icon">👀</div>
          <h3>Vzhled jídla</h3>
          <select id="vzhled" name="foodAppearance" value={formData.foodAppearance} onChange={handleChange}>
            <option value="">Vyberte</option>
            <option value="5">Výborná</option>
            <option value="4">Dobrá</option>
            <option value="3">Průměrná</option>
            <option value="2">Špatná</option>
            <option value="1">Velmi špatná</option>
          </select>
        </div>

        <div className="rating-card">
          <div className="rating-icon">❤️</div>
          <h3>Chuť jídla</h3>
          <select id="chut" name="willingToPay" value={formData.willingToPay} onChange={handleChange}>
            <option value="">Vyberte</option>
            <option value="5">Výborná</option>
            <option value="4">Dobrá</option>
            <option value="3">Průměrná</option>
            <option value="2">Špatná</option>
            <option value="1">Velmi špatná</option>
          </select>
        </div>
        <div className="rating-card">
          <div className="rating-icon">📷</div>
          <h3>Fotka</h3>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange}/>
        </div>
      </div>

      <button className="submit-btn"
              onClick={handleSubmit}>{sending ? 'Posílá hodnocení...' : 'Odeslat hodnocení'}</button>
    </div>
  );
}

export default RatingPage;
