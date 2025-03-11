import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
      navigate('/');
      return;
    }

    fetch('http://localhost:3001/admin', {
      method: 'GET',
      headers: {
        'Authorization': authToken,
      },
    })
      .then(response => response.json())
      .then(isAdmin => {
        if (!isAdmin) {
          navigate('/'); // Redirect if not an admin
        }
      })
      .catch(() => {
        navigate('/'); // Redirect on error
      });
  }, [navigate]);
}

export default useAuthRedirect;
