import React, { useState } from 'react';
import '../App.css';
import useAuthRedirect from "../hooks/useAuthRedirect";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

function OhodnotAplikaci() {
  useAuthRedirect();

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base64, setBase64] = useState("");
  const [rating, setRating] = useState(0);

  const back = () => {
        navigate('/main');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBase64(reader.result); // Base64 string
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64", error);
      };
    }
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const sendFeedback = async () => {
    try {
      const image = base64.slice(22);
      const credentials = Cookies.get('authToken');

      const feedbackData = {
        title,
        description,
        image,
        rating
      };
      console.log(JSON.stringify(feedbackData))

      const response = await fetch("http://localhost:3001/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': credentials,
        },
        body: JSON.stringify(feedbackData),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Chyba při odesílání hodnocení. Zkuste to prosím znovu.");
    }
  };

  sendFeedback();
};

  return (
      <div className="container">

        <button
            onClick={back}
            style={{
              position: 'fixed', top: '20px', left: '20px', cursor: 'pointer',
              backgroundColor: '#007bff', color: '#fff', border: 'none',
              padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem'
            }}
        >
          Back
        </button>

        <header>
          <h1 className="header-title">Ohodnoť aplikaci</h1>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Titulek */}
          <div>
            <label htmlFor="title">Titulek:</label>
            <input
                type="text"
                id="title"
                name="title"
                placeholder="Zadejte titulek hodnocení"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
          </div>

          {/* Popis */}
          <div>
            <label htmlFor="description">Popis:</label>
            <textarea
                id="description"
                name="description"
                placeholder="Popište, jak se Vám aplikace líbí"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image">Nahrát obrázek:</label>
            <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
            />
          </div>

          {/* Výběr hodnocení */}
          <div>
            <label htmlFor="rating">Hodnocení aplikace (1-5):</label>
            <select
                id="rating"
                name="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
            >
              <option value="0" disabled>
                Vyberte hodnocení
              </option>
              <option value="5">5 - Výborná</option>
              <option value="4">4 - Dobrá</option>
              <option value="3">3 - Průměrná</option>
              <option value="1">1 - Velmi špatná</option>
              <option value="2">2 - Špatná</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Odeslat hodnocení
          </button>
        </form>
      </div>
  );
}

export default OhodnotAplikaci;