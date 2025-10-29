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

  // ✅ Check if user is logged in
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
  }, []);

  // ✅ Fetch paginated search history
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

  // ✅ Google login / logout handlers
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  // ✅ Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/search",
        { term },
        { withCredentials: true }
      );

      setImages(res.data.results || []);
      setSelected([]);
      fetchHistory(1); // refresh history
    } catch (err) {
      console.error(err);
      alert("Please log in to search images.");
    }
  };

  // ✅ Toggle selected image
  const toggleSelect = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

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
      <h1 style={{ fontSize: "2rem", color: "#333" }}>🔍 Searchify</h1>

      {!user ? (
        <>
          <p>Login with your Google account to search images</p>
          <button
            onClick={handleLogin}
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
        </>
      ) : (
        <>
          {/* ✅ User Info */}
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

            {/* Pagination Controls */}
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
                  backgroundColor: page === totalPages ? "#f2f2f2" : "#007bff",
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
