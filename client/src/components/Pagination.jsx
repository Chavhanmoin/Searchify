import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        ⬅ Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next ➡
      </button>
    </div>
  );
}
