import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  
  const handleMealClick = () => {
    navigate('/rating');
  };

  
  const handleRateAppClick = () => {
    navigate('/rate-app');
  };

  return (
    <>
      
      <div
        style={{
          position: 'fixed',       
          top: '20px',
          right: '20px',
          cursor: 'pointer',
          color: '#4A90E2',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
        onClick={handleRateAppClick}
      >
        Ohodnoť aplikaci
      </div>

      <div className="container">
        <header>
          <div className="logo">SPŠE Ječná</div>
          <h1 className="header-title">Přehled obědů</h1>
        </header>

        <div className="day-block">
          <div className="day-date">Pondělí 29. 1. 2025</div>
          <div className="meal-list">
            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Kuřecí vývar</div>
              <div className="star-display">
                ★★★★<span className="inactive">★</span>
              </div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Špagety s omáčkou</div>
              <div className="star-display">
                ★★★<span className="inactive">★★</span>
              </div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Jablečný štrúdl</div>
              <div className="star-display">★★★★★</div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Džus</div>
              <div className="star-display">
                ★★★<span className="inactive">★★</span>
              </div>
            </div>
          </div>
        </div>

        <div className="day-block">
          <div className="day-date">Úterý 30. 1. 2025</div>
          <div className="meal-list">
            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Gulášová polévka</div>
              <div className="star-display">
                ★★★<span className="inactive">★★</span>
              </div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Kuřecí řízek s bramborovou kaší</div>
              <div className="star-display">★★★★★</div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Puding</div>
              <div className="star-display">
                ★★<span className="inactive">★★★</span>
              </div>
            </div>

            <div className="meal-item" onClick={handleMealClick}>
              <div className="meal-name">Čaj</div>
              <div className="star-display">
                ★★★★<span className="inactive">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
