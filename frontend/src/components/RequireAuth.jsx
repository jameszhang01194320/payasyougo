// components/RequireAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAuth = ({ isLoggedIn, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn]);

  return isLoggedIn ? children : null;
};

export default RequireAuth;
