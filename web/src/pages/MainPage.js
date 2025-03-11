import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays,faCheck } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';

function MainPage() {
    useAuthRedirect();
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingNextPage, setLoadingNextPage] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);



    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filter = queryParams.get("filter");

        const fetchData = async () => {
            try {
                setError(null); // Reset error before a new request
                const credentials = Cookies.get('authToken');

                const response = await fetch(`http://localhost:3001/menu?page=${page}&limit=3&filter=${filter}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': credentials,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (!data || typeof data !== 'object') {
                    throw new Error("Invalid data format received from API.");
                }

                setMenuData(prevData => (page === 1 ? [data] : [...prevData, data]));

            } catch (err) {
                console.error("Error fetching menu:", err);
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingNextPage(false);
            }
        };

        fetchData();
    }, [page]);

    const logOut = () => {
        Cookies.remove('authToken');
        navigate('/');
    };

    const adminNav = () => {
        navigate('/admin');
    };

    function handleMealClick(id) {
        navigate('/rating/' + id);
    };

    const handleRateAppClick = () => {
        navigate('/rate-app');
    };

    const handleNextPageClick = () => {
        setLoadingNextPage(true);
        setPage(prevPage => prevPage + 1);
    };

    return (
        <>
            <div id={'buttons'}>
                <button id={'logout'}
                    onClick={logOut}
                >
                    Logout
                </button>

                <button
                    id={'back'}
                    onClick={handleRateAppClick}
                >
                    Ohodnoť aplikaci
                </button>

                <button
                    id={'admin'}
                    onClick={adminNav}
                >
                    Admin
                </button>
            </div>

            <div className="container">
                <header>
                    <div className="logo">SPŠE Ječná</div>
                    <div className="filter">
                        <p>Filters:</p>
                        <a href={'/main'}><FontAwesomeIcon icon={faCalendarDays}/></a>
                        <a href={'/main?filter=unrated'}><FontAwesomeIcon icon={faCheck}/></a>
                    </div>
                    <h1 className="header-title">Přehled obědů</h1>
                </header>

                {loading ? (
                    <div className="loading">Načítání...</div>
                ) : error ? (
                    <div className="error">Chyba: {error}</div>
                ) : menuData.length > 0 ? (
                    menuData.map((dayData, idx) => (
                        Object.entries(dayData).map(([date, meals]) => (
                            <div className="day-block" key={idx}>
                                <div className="day-date">{date}</div>
                                <div className="meal-list">
                                    {(Array.isArray(meals) ? meals : []).map(meal => (
                                        <div className="meal-item" key={meal.id}>
                                            <div className="meal-name">{meal.name}</div>
                                            {meal.hasRated === 0 ? (
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
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="gallery-block" style={{marginBottom: '30px'}}>
                                    <div
                                        className="gallery-container"
                                        style={{
                                            display: 'flex',
                                            overflowX: 'auto',
                                            gap: '10px',
                                            padding: '10px'
                                        }}
                                    >
                                        {(Array.isArray(meals) ? meals : []).map(meal => {
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
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ))
                ) : (
                    <div>No data available</div>
                )}

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
                        disabled={loadingNextPage}
                    >
                        {loadingNextPage ? 'Načítám...' : 'Načíst další stránku'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default MainPage;

