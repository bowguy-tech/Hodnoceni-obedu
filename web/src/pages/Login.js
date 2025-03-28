import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch('http://localhost:3001/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const isAdmin = await response.json(); // Expecting true or false
      Cookies.set('authToken', `Basic ${credentials}`, { expires: 7 });
      Cookies.set('admin', isAdmin ? 'true' : 'false', { expires: 7 });

      console.log('Admin status:', isAdmin);
    } catch (error) {
      setError('Login failed');
    } finally {
      setLoading(false);
      navigate('/main'); // Redirect to /main after attempt
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="header-title">Přihlášení</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Vložte Váš username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span>Loading...</span> : 'Přihlásit se'}
        </button>
      </form>
    </div>
  );
}

export default Login;
