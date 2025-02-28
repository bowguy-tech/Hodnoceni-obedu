import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import Cookies from 'js-cookie';

function MainPage() {
    useAuthRedirect();
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);  // Store the menu data for each page
    const [loading, setLoading] = useState(true);  // Loading for the initial load
    const [loadingNextPage, setLoadingNextPage] = useState(false);  // Loading for the next page
    const [page, setPage] = useState(1);  // Track the current page

    useEffect(() => {
        const credentials = Cookies.get('authToken');

        // Fetch menu data with lazy loading
        fetch(`http://localhost:3001/menu?page=${page}&limit=3`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': credentials,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);  // Log the response data to check its structure
                if (data && typeof data === 'object') {
                    // Only update menuData if it's the first page or new page
                    if (page === 1) {
                        setMenuData([data]);  // For the first page, replace old data with new
                    } else {
                        setMenuData(prevData => [...prevData, data]);  // Append new page's data
                    }
                } else {
                    console.error('API response is not an object:', data);
                }
                setLoading(false);  // Set loading to false after data is loaded
                setLoadingNextPage(false);  // Set next page loading to false
            })
            .catch(error => {
                console.error('Error fetching menu:', error);
                setLoading(false);  // Ensure loading is stopped even in case of error
                setLoadingNextPage(false);  // Ensure next page loading is stopped
            });
    }, [page]);  // Depend on page so that the page updates trigger a new fetch

    const logOut = () => {
        Cookies.remove('authToken');
        navigate('/');
    };

    function handleMealClick(id) {
        navigate('/rating/' + id);
    };

    const handleRateAppClick = () => {
        navigate('/rate-app');
    };

    const handleNextPageClick = () => {
        setLoadingNextPage(true);  // Show loading for the next page
        setPage(prevPage => prevPage + 1);  // Increment page number to load the next page
    };

    return (
        <>
            <button
                onClick={handleRateAppClick}
                style={{
                    position: 'fixed', top: '20px', right: '20px', cursor: 'pointer',
                    backgroundColor: '#007bff', color: '#fff', border: 'none',
                    padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem'
                }}
            >
                Ohodnoť aplikaci
            </button>

            <button
                onClick={logOut}
                style={{
                    position: 'fixed', top: '20px', left: '20px', cursor: 'pointer',
                    backgroundColor: '#007bff', color: '#fff', border: 'none',
                    padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem'
                }}
            >
                Logout
            </button>

            <div className="container">
                <header>
                    <div className="logo">SPŠE Ječná</div>
                    <h1 className="header-title">Přehled obědů</h1>
                </header>

                {loading ? (
                    <div className="loading">Načítání...</div>
                ) : (
                    menuData.length > 0 ? (
                        menuData.map((dayData, idx) => {
                            return Object.entries(dayData).map(([date, meals]) => (
                                <div className="day-block" key={idx}>
                                    <div className="day-date">{date}</div>
                                    <div className="meal-list">
                                        {meals.map(meal => (
                                            <div className="meal-item" key={meal.id}>
                                                <div className="meal-name">{meal.name}</div>
                                                {
                                                    meal.hasRated === 0 ? (
                                                        <button
                                                            onClick={() => handleMealClick(meal.id)}
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
                                                    ) : (
                                                        <button
                                                            style={{
                                                                backgroundColor: '#ff0000',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                border: 'none',
                                                                padding: '8px 12px',
                                                                borderRadius: '4px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            Ohodnoceno
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        ))}
                                    </div>

                                    {/* Gallery for each day - dynamically populated based on meals' images */}
                                    <div className="gallery-block" style={{ marginBottom: '30px' }}>
                                        <div
                                            className="gallery-container"
                                            style={{
                                                display: 'flex',
                                                overflowX: 'auto',
                                                gap: '10px',
                                                padding: '10px'
                                            }}
                                        >
                                            {meals.map(meal => {
                                                if (meal.image) {
                                                    return (
                                                        <img
                                                            key={meal.id}
                                                            src={`data:image/jpeg;base64,${meal.image}`}
                                                            alt={meal.name}
                                                            style={{
                                                                minWidth: '200px',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                        />
                                                    );
                                                }
                                                return null; // If no image exists, skip this meal
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ));
                        })
                    ) : (
                        <div>No data available</div>  // Handle case when menuData is empty
                    )
                )}

                {/* Button to load next page */}
                <div className="next-page-button">
                    <button
                        onClick={handleNextPageClick}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            cursor: 'pointer',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            width: '100%',
                            marginTop: '20px'
                        }}
                        disabled={loadingNextPage}  // Disable the button while loading next page
                    >
                        {loadingNextPage ? 'Načítám...' : 'Načíst další stránku'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default MainPage;
