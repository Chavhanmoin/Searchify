import React from 'react';

export default function TrendingSearches({ topSearches, maxCount, onSearch }) {
  return (
    <div className="trending-container">
      <h3 className="trending-title">🔥 Trending Searches</h3>
      {topSearches.map((item, index) => {
        const rankEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
        const widthPercent = (item.count / maxCount) * 100;
        const glowColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
        const barColors = [
          "linear-gradient(90deg, #FFD700, #FFA000)",
          "linear-gradient(90deg, #C0C0C0, #B0BEC5)",
          "linear-gradient(90deg, #CD7F32, #8D6E63)",
          "linear-gradient(90deg, #90CAF9, #42A5F5)",
          "linear-gradient(90deg, #A5D6A7, #66BB6A)",
        ];
        const isTop3 = index < 3;

        return (
          <div
            key={index}
            onClick={() => onSearch(item.term)}
            className="trend-item"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = `0 0 15px ${
                glowColors[index] || "#ccc"
              }`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isTop3 && (
              <div
                className="trend-item-glow"
                style={{
                  background: `radial-gradient(circle at center, ${
                    glowColors[index]
                  }22 0%, transparent 70%)`,
                }}
              ></div>
            )}
            <div
              className="trend-item-bar"
              style={{
                width: `${widthPercent}%`,
                background: barColors[index],
              }}
            ></div>
            <div className="trend-item-text">
              <span>
                {rankEmojis[index]} {item.term}
              </span>
              <span className="trend-item-count">{item.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}