import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  // Přesměrování na stránku s hodnocením oběda
  const handleMealClick = () => {
    navigate('/rating');
  };

  // Přesměrování na stránku s hodnocením aplikace
  const handleRateAppClick = () => {
    navigate('/rate-app');
  };

  return (
    <>
      {/* Modré tlačítko "Ohodnoť aplikaci" v pravém horním rohu */}
      <button
        onClick={handleRateAppClick}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          cursor: 'pointer',
          backgroundColor: '#007bff', // modrá
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        Ohodnoť aplikaci
      </button>

      <div className="container">
        <header>
          <div className="logo">SPŠE Ječná</div>
          <h1 className="header-title">Přehled obědů</h1>
        </header>

        {/* ========== PONDĚLÍ ========== */}
        <div className="day-block">
          <div className="day-date">Pondělí 29. 1. 2025</div>
          <div className="meal-list">
            <div className="meal-item">
              <div className="meal-name">Kuřecí vývar</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59', // zelená dle #37cc59
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Špagety s omáčkou</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Jablečný štrúdl</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Džus</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
          </div>
        </div>

        {/* ========== GALERIE (posuvná) ========== */}
        <div className="gallery-block" style={{ marginBottom: '30px' }}>
          <h2 className="gallery-title" style={{ textAlign: 'center', marginBottom: '15px' }}>
            Galerie
          </h2>
          <div
            className="gallery-container"
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '10px',
              padding: '10px'
            }}
          >
            <img
              src="/gallery1.jpg"
              alt="Galerie 1"
              style={{
                minWidth: '200px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <img
              src="/gallery2.jpg"
              alt="Galerie 2"
              style={{
                minWidth: '200px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <img
              src="/gallery3.jpg"
              alt="Galerie 3"
              style={{
                minWidth: '200px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <img
              src="/gallery4.jpg"
              alt="Galerie 4"
              style={{
                minWidth: '200px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>

        {/* ========== ÚTERÝ ========== */}
        <div className="day-block">
          <div className="day-date">Úterý 30. 1. 2025</div>
          <div className="meal-list">
            <div className="meal-item">
              <div className="meal-name">Gulášová polévka</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Kuřecí řízek s bramborovou kaší</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Puding</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
            <div className="meal-item">
              <div className="meal-name">Čaj</div>
              <button
                onClick={handleMealClick}
                style={{
                  backgroundColor: '#37cc59',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Ohodnoť oběd
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
