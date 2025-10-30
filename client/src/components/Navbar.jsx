import React from 'react';

// --- 1. Accept the new prop ---
export default function Navbar({ user, onLogout, onToggleSidebar, onNavigate, setFullscreenImage }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="hamburger-menu" onClick={onToggleSidebar}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
        <div className="brand" onClick={() => onNavigate('main')}>
          Searchify
        </div>
      </div>
      <div className="user-info">
        {/* --- 2. Add the onClick handler --- */}
        <img 
          src={user.profilePhoto} 
          alt="Profile" 
          className="avatar" 
          onClick={() => setFullscreenImage(user.profilePhoto)}
        />
        <span>{user.displayName}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
