import React from 'react';

export default function SelectionBar({ count, onClearSelection }) {
  return (
    <div className="selection-bar">
      <div className="selection-info">
        <span>{count}</span> image{count > 1 ? "s" : ""} selected
      </div>
      <button className="selection-clear" onClick={onClearSelection}>
        Clear Selection
      </button>
    </div>
  );
}