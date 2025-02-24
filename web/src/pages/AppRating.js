import React, { useState } from 'react';
import '../App.css';
import useAuthRedirect from "../hooks/useAuthRedirect";

function OhodnotAplikaci() {
  useAuthRedirect();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Titulek:', title);
    console.log('Popis:', description);
    console.log('Obrázek:', imageFile);
    console.log('Hodnocení:', rating);
    console.log('Komentář:', comment);
    console.log('Doporučuji aplikaci:', recommend);
    alert('Hodnocení bylo odesláno!');
  };

  return (
    <div className="container">
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
            <option value="1">1 - Velmi špatná</option>
            <option value="2">2 - Špatná</option>
            <option value="3">3 - Průměrná</option>
            <option value="4">4 - Dobrá</option>
            <option value="5">5 - Výborná</option>
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