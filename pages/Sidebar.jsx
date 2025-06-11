// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaImage } from 'react-icons/fa';

const Sidebar = () => {
  const loggedInUserId = localStorage.getItem('userid');

  return (
    <div
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <h2 style={{ color: 'cyan' }}>My App</h2>
      <nav style={{ marginTop: '40px' }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            color: isActive ? 'cyan' : 'white',
            textDecoration: 'none',
            gap: '10px',
          })}
        >
          <FaHome /> Home
        </NavLink>

        <NavLink
          to={`/profile/${loggedInUserId}`}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            color: isActive ? 'cyan' : 'white',
            textDecoration: 'none',
            gap: '10px',
          })}
        >
          <FaUser /> Profile
        </NavLink>

        <NavLink
          to="/posts"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            color: isActive ? 'cyan' : 'white',
            textDecoration: 'none',
            gap: '10px',
          })}
        >
          <FaImage /> Posts
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;