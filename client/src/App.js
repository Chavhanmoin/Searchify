import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Import Page Components
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import HistoryPage from "./pages/HistoryPage";

// Import UI Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppFooter from "./components/AppFooter";
import LandingFooter from "./components/LandingFooter";
import FullscreenViewer from "./components/FullscreenViewer";
import SelectionBar from "./components/SelectionBar";

function App() {
  // All application state lives here
  const [user, setUser] = useState(null);
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]); // For image selection
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topSearches, setTopSearches] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null); 
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('main'); // 'main' or 'history'

  // --- NEW: State for history selection ---
  const [selectedHistory, setSelectedHistory] = useState([]);

  // All data fetching and logic lives here
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
    const interval = setInterval(() => fetchTopSearches(), 10000);
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

    setLoading(true); 
    setSearchInfo(null); 
    setImages([]); 

    try {
      const res = await axios.post(
        "http://localhost:5000/api/search",
        { term: searchTerm, page: 1 }, 
        { withCredentials: true }
      );

      setImages(res.data.results || []);
      setSelected([]);
      setTerm(searchTerm);
      setPage(1);
      setSearchInfo({ term: res.data.term, total: res.data.total }); 
      fetchHistory(1);
    } catch (err) {
      console.error(err);
      alert("Please log in to search images.");
    } finally {
      setLoading(false); 
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    
    try {
      const res = await axios.post(
        "http://localhost:5000/api/search",
        { term, page: nextPage }, 
        { withCredentials: true }
      );
      setImages((prev) => [...prev, ...(res.data.results || [])]);
      setPage(nextPage); 
    } catch (err) {
      console.error("❌ Error loading more images:", err);
    }
  };

  const toggleSelect = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const navigateTo = (viewName) => {
    setSelectedHistory([]); // Clear history selection when changing views
    setView(viewName);
    setIsSidebarOpen(false);
  };
  
  // --- Handlers for History Deletion ---

  const toggleHistorySelection = (id) => {
    setSelectedHistory((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllHistory = () => {
    // If all are already selected, clear selection. Otherwise, select all.
    if (selectedHistory.length === history.length) {
      setSelectedHistory([]);
    } else {
      setSelectedHistory(history.map(item => item._id));
    }
  };

  const handleDeleteHistory = async () => {
    if (selectedHistory.length === 0) return;
    
    const remainingHistory = history.filter(item => !selectedHistory.includes(item._id));
    setHistory(remainingHistory);
    const currentPage = page; // Store current page
    setSelectedHistory([]);

    try {
      await axios.delete("http://localhost:5000/api/history", {
        data: { ids: selectedHistory }, 
        withCredentials: true,
      });
      // Refetch the current page to get new items and correct pagination
      fetchHistory(currentPage); 
    } catch (err) {
      console.error("Error deleting history:", err);
      // If error, refetch
      fetchHistory(currentPage);
    }
  };

  const maxCount = Math.max(...topSearches.map((t) => t.count), 1);
  
  /* -------------------------
     🧩 Render UI
  --------------------------*/

  // Render Landing Page if no user
  if (!user) {
    return (
      <div className="landing-page">
        <LandingPage onLogin={handleLogin} />
        <LandingFooter />
      </div>
    );
  }

  // Render Dashboard if user exists
  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={navigateTo} 
      />
      
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onNavigate={navigateTo}
        setFullscreenImage={setFullscreenImage}
      />
      
      <div className="page-content-wrapper">
        {view === 'main' && (
          <MainPage
            topSearches={topSearches}
            maxCount={maxCount}
            term={term}
            setTerm={setTerm}
            handleSearch={handleSearch}
            loading={loading}
            searchInfo={searchInfo}
            images={images}
            selected={selected}
            toggleSelect={toggleSelect}
            setFullscreenImage={setFullscreenImage}
            handleLoadMore={handleLoadMore}
          />
        )}
        
        {view === 'history' && (
          <HistoryPage
            history={history}
            page={page}
            totalPages={totalPages}
            fetchHistory={fetchHistory}
            handleSearchAndNavigate={(term) => {
              navigateTo('main');
              handleSearch(null, term);
            }}
            selectedHistory={selectedHistory}
            onToggleSelect={toggleHistorySelection}
            onSelectAll={handleSelectAllHistory}
            onDelete={handleDeleteHistory}
          />
        )}
      </div> 

      {fullscreenImage && (
        <FullscreenViewer 
          image={fullscreenImage} 
          onClose={() => setFullscreenImage(null)} 
        />
      )}
      
      {selected.length > 0 && (
        <SelectionBar 
          count={selected.length} 
          onClearSelection={() => setSelected([])}
        />
      )}

      <AppFooter />
    </div>
  );
}

export default App;
