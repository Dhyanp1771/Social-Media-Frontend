import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call backend to clear refreshToken cookie
        await axios.post(
          'http://localhost:5000/api/auth/logout',
          {},
          { withCredentials: true }
        );

        // Clear access token from localStorage (if stored)
        localStorage.removeItem('accessToken');

        // Optional: Clear Redux/context state here if used

        // Navigate to login or homepage
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message);
      }
    };

    logout();
  }, [navigate]);

  return null; // or show a spinner/message while logging out
};

export default Logout;
