import React from 'react';
import Pagination from '../components/Pagination';

export default function HistoryPage({ 
  history, 
  page, 
  totalPages, 
  fetchHistory, 
  handleSearchAndNavigate,
  selectedHistory,
  onToggleSelect,
  onSelectAll,
  onDelete
}) {

  const allOnPageSelected = history.length > 0 && selectedHistory.length === history.length;

  return (
    <div className="history-page-container">
      <div className="history-header">
        <h1 className="history-page-title">My Search History</h1>
        {selectedHistory.length > 0 && (
          <button className="delete-history-btn" onClick={onDelete}>
            Delete ({selectedHistory.length})
          </button>
        )}
      </div>

      <div className="history-container">
        {history.length === 0 ? (
          <p>No search history yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input 
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={onSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Term</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                const isSelected = selectedHistory.includes(item._id);
                return (
                  <tr
                    key={item._id}
                    className={isSelected ? 'selected' : ''}
                  >
                    <td 
                      className="checkbox-cell"
                      onClick={() => onToggleSelect(item._id)} // Click cell to toggle
                    >
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item._id)}
                        // --- THIS IS THE FIX ---
                        // Stop the click from bubbling up to the <td>
                        onClick={(e) => e.stopPropagation()} 
                        // --- END FIX ---
                      />
                    </td>
                    
                    {/* Make cells clickable for search */}
                    <td onClick={() => handleSearchAndNavigate(item.term)}>
                      {(page - 1) * 7 + index + 1}
                    </td>
                    <td onClick={() => handleSearchAndNavigate(item.term)}>
                      {item.term}
                    </td>
                    <td className="history-time" onClick={() => handleSearchAndNavigate(item.term)}>
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {history.length > 0 && (
          <Pagination 
            page={page}
            totalPages={totalPages}
            onPageChange={fetchHistory}
          />
        )}
      </div>
    </div>
  );
}
