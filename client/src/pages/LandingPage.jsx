import React from 'react';

export default function LandingPage({ onLogin }) {
  return (
    <>
      <header className="landing-header">
        <div className="landing-brand">
          Searchify
        </div>
      </header>

      <div className="landing-hero">
        <h1>Get your next image</h1>
      </div>

      <div className="masonry-background">
        <div className="masonry-column">
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500" alt="tech"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=500" alt="desk"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1550745165-9bc0b252726c?w=500" alt="retro"/></div>
        </div>
        <div className="masonry-column">
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=500" alt="forest"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500" alt="nature"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=500" alt="beach"/></div>
        </div>
        <div className="masonry-column">
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500" alt="mountains"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1542273917363-3b1817e89363?w=500" alt="trees"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500" alt="path"/></div>
        </div>
        <div className="masonry-column">
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=500" alt="flowers"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500" alt="hike"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500" alt="green forest"/></div>
        </div>
        <div className="masonry-column">
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" alt="sand"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500" alt="field"/></div>
          <div className="masonry-item"><img src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500" alt="river"/></div>
        </div>
      </div>

      <div className="landing-center-box">
        <h2>Find your images.</h2>
        <p>Login to start searching</p>
        <div className="auth-buttons">
          <button
            onClick={() => onLogin("google")}
            className="auth-button google"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
            />
            Continue with Google
          </button>
          <button
            onClick={() => onLogin("facebook")}
            className="auth-button facebook"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
              alt="Facebook"
            />
            Continue with Facebook
          </button>
          <button
            onClick={() => onLogin("github")}
            className="auth-button github"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt="GitHub"
            />
            Continue with GitHub
          </button>
        </div>
      </div>
    </>
  );
}