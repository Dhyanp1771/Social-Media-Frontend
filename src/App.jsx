import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from '../pages/Register';
import Login from '../pages/Login';
import ActivateAccount from '../pages/ActivateAccount';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Logout from '../pages/Logout';
import ProfilePage from '../pages/ProfilePage';
import Search from '../pages/Search';
import Sidebar from '../pages/SideBar';
import Posts from '../pages/Posts';
import LandingPage from '../pages/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const unauthenticatedRoutes = [
    '/',
    '/register',
    '/login',
    '/activate',
    '/forgot-password',
    '/reset-password/:token',
  ];

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && !unauthenticatedRoutes.includes(window.location.pathname) && (
          <Sidebar />
        )}
        <div
          style={{
            marginLeft: isAuthenticated && !unauthenticatedRoutes.includes(window.location.pathname) ? '220px' : '0',
            padding: '20px',
            width: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activate" element={<ActivateAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/find-friends" element={<Search />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;