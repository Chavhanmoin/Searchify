import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topSearches, setTopSearches] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/success", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          fetchHistory(1);
        }
      })
      .catch(() => setUser(null));

    fetchTopSearches();
  }, []);
    useEffect(() => {
    const interval = setInterval(() => {
      fetchTopSearches();
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async (pageNum = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/history?page=${pageNum}&limit=7`,
        { withCredentials: true }
      );
      setHistory(res.data.history);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  };

  const fetchTopSearches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/top-searches");
      setTopSearches(res.data);
    } catch (err) {
      console.error("❌ Error fetching top searches:", err);
    }
  };

  const handleLogin = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  const handleSearch = async (e, searchTerm = term) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/search",
        { term: searchTerm },
        { withCredentials: true }
      );
      setImages(res.data.results || []);
      setSelected([]);
      fetchHistory(1);
      setTerm(searchTerm);
    } catch (err) {
      console.error(err);
      alert("Please log in to search images.");
    }
  };

  const toggleSelect = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const maxCount = Math.max(...topSearches.map((t) => t.count), 1);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        fontFamily: "sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* 🌟 Trending Searches Banner */}
      {topSearches.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            padding: "20px",
            maxWidth: "500px",
            margin: "20px auto",
            textAlign: "left",
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              color: "#ff5722",
              fontWeight: "bold",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "1.4rem",
            }}
          >
            🔥 Trending Searches
          </h3>

          {topSearches.map((item, index) => {
            const rankEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
            const widthPercent = (item.count / maxCount) * 100;
            const glowColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
            const barColor = [
              "linear-gradient(90deg, #FFD700, #FFA000)",
              "linear-gradient(90deg, #C0C0C0, #B0BEC5)",
              "linear-gradient(90deg, #CD7F32, #8D6E63)",
              "linear-gradient(90deg, #90CAF9, #42A5F5)",
              "linear-gradient(90deg, #A5D6A7, #66BB6A)",
            ][index];

            const isTop3 = index < 3;

            return (
              <div
                key={index}
                onClick={() => handleSearch(null, item.term)}
                style={{
                  marginBottom: "12px",
                  background: "#fafafa",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
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
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `radial-gradient(circle at center, ${
                        glowColors[index]
                      }22 0%, transparent 70%)`,
                      animation: "pulse 2s infinite",
                      zIndex: 0,
                    }}
                  ></div>
                )}

                <div
                  style={{
                    width: `${widthPercent}%`,
                    background: barColor,
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0.25,
                    transition: "width 0.5s ease-in-out",
                    zIndex: 0,
                  }}
                ></div>

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    zIndex: 1,
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {rankEmojis[index]} {item.term}
                  </span>
                  <span style={{ color: "#555", fontSize: "0.9rem" }}>
                    {item.count} searches
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.6; }
          }
        `}
      </style>

      <h1 style={{ fontSize: "2rem", color: "#333" }}>🔍 Searchify</h1>

      {!user ? (
        <>
          <p>Login with one of your accounts to continue</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button
              onClick={() => handleLogin("google")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Continue with Google
            </button>

            <button
              onClick={() => handleLogin("facebook")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1877F2",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Continue with Facebook
            </button>

            <button
              onClick={() => handleLogin("github")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#333",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Continue with GitHub
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <img
              src={user.profilePhoto}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: "60px",
                marginBottom: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <h2>Welcome, {user.displayName}! 👋</h2>
            <p style={{ color: "#555" }}>{user.email}</p>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                backgroundColor: "#db4437",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

          {/* Search + Image + History section remains same */}
          {/* ✅ Search Bar */}
          <form onSubmit={handleSearch} style={{ marginTop: "30px" }}>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search for images..."
              style={{
                padding: "10px",
                width: "300px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: "10px",
                padding: "10px 15px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

          {/* ✅ Selected Counter */}
          {selected.length > 0 && (
            <p style={{ marginTop: "15px", fontWeight: "bold" }}>
              Selected: {selected.length} image
              {selected.length > 1 ? "s" : ""}
            </p>
          )}

          {/* ✅ Image Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
              padding: "20px",
              justifyItems: "center",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {images
              .filter((img) => img?.thumb && img?.full)
              .map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <img
                    src={img.thumb}
                    alt={img.description || "Unsplash Image"}
                    style={{
                      width: "200px",
                      height: "150px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      border: selected.includes(img.full)
                        ? "3px solid #4CAF50"
                        : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleSelect(img.full)}
                  />
                  <input
                    type="checkbox"
                    checked={selected.includes(img.full)}
                    onChange={() => toggleSelect(img.full)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </div>
              ))}
          </div>

          {/* ✅ Search History */}
          <div
            style={{
              marginTop: "40px",
              textAlign: "left",
              maxWidth: "600px",
              margin: "40px auto",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              🕓 Search History
            </h3>
            {history.length === 0 ? (
              <p>No search history yet.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f7f7f7" }}>
                    <th style={{ padding: "8px", textAlign: "left" }}>#</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Term</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item._id}>
                      <td style={{ padding: "8px" }}>
                        {(page - 1) * 7 + index + 1}
                      </td>
                      <td style={{ padding: "8px" }}>{item.term}</td>
                      <td style={{ padding: "8px", color: "#666" }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => fetchHistory(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: page === 1 ? "#f2f2f2" : "#007bff",
                  color: page === 1 ? "#999" : "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ⬅ Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchHistory(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor:
                    page === totalPages ? "#f2f2f2" : "#007bff",
                  color: page === totalPages ? "#999" : "white",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next ➡
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
