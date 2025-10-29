import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);

  // ✅ Check if user is logged in
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/success", { withCredentials: true })
      .then((res) => {
        if (res.data.user) setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

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
              Selected: {selected.length} image{selected.length > 1 ? "s" : ""}
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
        </>
      )}
    </div>
  );
}

export default App;
