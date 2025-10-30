import React from 'react';

export default function FullscreenViewer({ image, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fullscreen-viewer"
    >
      <img src={image} alt="Full" />
    </div>
  );
}
