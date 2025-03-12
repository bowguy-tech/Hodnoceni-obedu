import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import adminToken from "../hooks/useAdminToken";

function AdminPage() {
    adminToken();
    const navigate = useNavigate();
    const [foodItems, setFoodItems] = useState([]);
    const credentials = Cookies.get('authToken');

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await fetch('http://localhost:3001/admin_catalog', {
                    method: 'GET',
                    headers: {
                        'Authorization': credentials,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch food ratings');
                }

                const data = await response.json();
                if (Array.isArray(data[0])) {
                    setFoodItems(data[0]);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching food ratings:', error);
            }
        };

        fetchFoodData();
    }, [credentials]);

    const formatTemperature = (value) => {
        if (value === null || value === undefined) return '-';
        const num = parseFloat(value);
        if (isNaN(num)) return '-';
        if (Math.abs(num - 1) < Math.abs(num - 2) && Math.abs(num - 1) < Math.abs(num - 3)) {
            return "Moc studené";
        } else if (Math.abs(num - 2) < Math.abs(num - 1) && Math.abs(num - 2) < Math.abs(num - 3)) {
            return "Ideální";
        } else {
            return "Moc teplé";
        }
    };

    const getColor = (value) => {
        if (value === null || value === undefined || isNaN(value)) return "black";
        const num = parseFloat(value);
        if (num >= 4.5) return "green";
        if (num >= 3.5) return "lightgreen";
        if (num >= 2.5) return "yellow";
        if (num >= 1.5) return "orange";
        return "red";
    };

    return (
        <div className="container">
            <style>
                {`
                    .container {
                        width: 90%;
                        margin: 20px auto;
                        font-family: Arial, sans-serif;
                    }

                    .back-button {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        cursor: pointer;
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 1rem;
                    }

                    .table-container {
                        overflow-x: auto;
                        margin-top: 20px;
                    }

                    .rating-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        background: #fff;
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        overflow: hidden;
                    }

                    .rating-table thead {
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                    }

                    .rating-table th, .rating-table td {
                        padding: 12px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                    }

                    .rating-table tr:hover {
                        background-color: #f1f1f1;
                    }
                `}
            </style>

            <button className="back-button" onClick={() => navigate('/main')}>
                Back
            </button>

            <header>
                <div className="logo">SPŠE Ječná</div>
                <h1 className="header-title">Admin - Přehled hodnocení jídel</h1>
            </header>

            <div className="table-container">
                <table className="rating-table">
                    <thead>
                        <tr>
                            <th>Název jídla</th>
                            <th>Velikost porce</th>
                            <th>Teplota</th>
                            <th>Hodnota za peníze</th>
                            <th>Vzhled</th>
                            <th>Počet hodnocení</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.length > 0 ? (
                            foodItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td style={{ color: getColor(item.size) }}>
                                        {item.size ? parseFloat(item.size).toFixed(2) : '-'}
                                    </td>
                                    <td>{formatTemperature(item.temperature)}</td>
                                    <td style={{ color: getColor(item.worth) }}>
                                        {item.worth ? parseFloat(item.worth).toFixed(2) : '-'}
                                    </td>
                                    <td style={{ color: getColor(item.appearance) }}>
                                        {item.appearance ? parseFloat(item.appearance).toFixed(2) : '-'}
                                    </td>
                                    <td>{item.number || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Načítání dat...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;
