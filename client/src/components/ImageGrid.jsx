import React from 'react';

export default function ImageGrid({ images, selected, toggleSelect, setFullscreenImage }) {
  return (
    <div className="image-grid">
      {images.map((img) => (
        <div key={img.id} className="image-card">
          <img
            src={img.thumb}
            alt={img.description || "Unsplash"}
            onClick={() => setFullscreenImage(img.full)}
            className={selected.includes(img.full) ? "selected" : ""}
          />
          <input
            type="checkbox"
            checked={selected.includes(img.full)}
            onChange={() => toggleSelect(img.full)}
          />
        </div>
      ))}
    </div>
  );
}
