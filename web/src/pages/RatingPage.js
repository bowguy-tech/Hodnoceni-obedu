import React from 'react';
import '../App.css'; // sdílíš styly, případně uprav dle potřeby

function RatingPage() {
  return (
    <div className="container">
      <header>
        <div className="logo">SPŠE Ječná</div>
        <h1 className="header-title">Hodnocení oběda</h1>
      </header>

      <div className="meal-info">
        {/* Fotka jídla (pokud je v public složce) */}
       

        <h2 className="meal-title">Kuřecí řízek s bramborovou kaší</h2>
        <p className="meal-description">Ochutnej dnešní oběd a ohodnoť!</p>
      </div>

      {/* Čtyři bloky hodnocení (Porce, Teplota, Vzhled, Chuť) */}
      <div className="rating-grid">
        {/* 1) Porce jídla */}
        <div className="rating-card">
          <div className="rating-icon">🍽</div>
          <h3>Porce jídla</h3>
          <div>
            <label htmlFor="porce">Vyberte hodnocení:</label>
            <select id="porce" name="porce" defaultValue="">
            <option value="" disabled></option>
              <option value="1">1 - Velmi špatná</option>
              <option value="2">2 - Špatná</option>
              <option value="3">3 - Průměrná</option>
              <option value="4">4 - Dobrá</option>
              <option value="5">5 - Výborná</option>
            </select>
          </div>
        </div>

        {/* 2) Teplota jídla */}
        <div className="rating-card">
          <div className="rating-icon">🌡</div>
          <h3>Teplota jídla</h3>
          <div>
            <label htmlFor="teplota">Vyberte hodnocení:</label>
            <select id="teplota" name="teplota" defaultValue="">
            <option value="" disabled></option>
              <option value="1">1 - Velmi špatná</option>
              <option value="2">2 - Špatná</option>
              <option value="3">3 - Průměrná</option>
              <option value="4">4 - Dobrá</option>
              <option value="5">5 - Výborná</option>
            </select>
          </div>
        </div>

        {/* 3) Vzhled jídla */}
        <div className="rating-card">
          <div className="rating-icon">👀</div>
          <h3>Vzhled jídla</h3>
          <div>
            <label htmlFor="vzhled">Vyberte hodnocení:</label>
            <select id="vzhled" name="vzhled" defaultValue="">
              <option value="" disabled></option>
              <option value="1">1 - Velmi špatná</option>
              <option value="2">2 - Špatná</option>
              <option value="3">3 - Průměrná</option>
              <option value="4">4 - Dobrá</option>
              <option value="5">5 - Výborná</option>
            </select>
          </div>
        </div>

        {/* 4) Chuť jídla */}
        <div className="rating-card">
          <div className="rating-icon">❤️</div>
          <h3>Chuť jídla</h3>
          <div>
            <label htmlFor="chut">Vyberte hodnocení:</label>
            <select id="chut" name="chut" defaultValue="">
              <option value="" disabled></option>
              <option value="1">1 - Velmi špatná</option>
              <option value="2">2 - Špatná</option>
              <option value="3">3 - Průměrná</option>
              <option value="4">4 - Dobrá</option>
              <option value="5">5 - Výborná</option>
            </select>
          </div>
        </div>
      </div>

      <button className="submit-btn">Odeslat hodnocení</button>
    </div>
  );
}

export default RatingPage;
