import React from 'react';

export default function Sidebar({ isOpen, onClose, onNavigate }) {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="sidebar-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => onNavigate('main')}>
            🔍 Search
          </button>
          <button onClick={() => onNavigate('history')}>
            🕓 View History
          </button>
        </nav>
      </aside>
    </>
  );
}