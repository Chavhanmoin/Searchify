import React from 'react';

function AppFooter() {
  return (
    <footer className="app-footer">
      <p>
        Crafted with ❤️ by Moin Chavhan
      </p>
      <a 
        href="https://github.com/Chavhanmoin/Searchify.git" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" 
          alt="GitHub" 
        />
        GitHub Repository
      </a>
    </footer>
  );
}

export default AppFooter;