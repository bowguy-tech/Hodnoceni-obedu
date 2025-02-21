
import React from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/main');
  };

  return (
    <div className="container">
      <header>
        <h1 className="header-title">Přihlášení</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Vložte Váš e-mail" 
            required
          />
        </div>

        <div>
          <label htmlFor="password">Heslo:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Zadejte heslo" 
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Přihlásit se</button>
      </form>
    </div>
  );
}

export default Login;
