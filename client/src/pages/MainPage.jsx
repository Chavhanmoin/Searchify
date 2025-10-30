import React from 'react';
import TrendingSearches from '../components/TrendingSearches';
import SearchBar from '../components/SearchBar';
import ImageGrid from '../components/ImageGrid';
import ImageSkeleton from '../components/ImageSkeleton';
import EmptyState from '../components/EmptyState';

export default function MainPage({
  topSearches,
  maxCount,
  term,
  setTerm,
  handleSearch,
  loading,
  searchInfo,
  images,
  selected,
  toggleSelect,
  setFullscreenImage,
  handleLoadMore
}) {
  return (
    <div className="main-content">
      {topSearches.length > 0 && (
        <TrendingSearches 
          topSearches={topSearches} 
          maxCount={maxCount}
          onSearch={(term) => handleSearch(null, term)}
        />
      )}

      <h1 className="main-title">🔍 Searchify</h1>

      <SearchBar
        term={term}
        setTerm={setTerm}
        onSubmit={handleSearch}
        loading={loading}
      />

      {searchInfo && !loading && (
        <p className="search-info">
          Showing results for <b>{searchInfo.term}</b> ({searchInfo.total} total)
        </p>
      )}

      {loading ? (
        <div className="image-grid">
          {[...Array(8)].map((_, i) => (
            <ImageSkeleton key={i} />
          ))}
        </div>
      ) : images.length > 0 ? (
        <ImageGrid
          images={images}
          selected={selected}
          toggleSelect={toggleSelect}
          setFullscreenImage={setFullscreenImage}
        />
      ) : searchInfo ? (
        <EmptyState 
          title={`No results found for "${searchInfo.term}"`}
          message="Try searching for something else!"
        />
      ) : (
        <EmptyState 
          title="Search for something to get started!"
          message='Try "nature", "computers", or "food".'
        />
      )}

      {images.length > 0 && !loading && (
        <button onClick={handleLoadMore} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
}