import React from 'react';

export default function SearchBar({ term, setTerm, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="search-bar">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for images..."
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "..." : "Search"}
      </button>
    </form>
  );
}
