import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      navigate('/');
    }
  }, [navigate]);
}

export default useAuthRedirect;
