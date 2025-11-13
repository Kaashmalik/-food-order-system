import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { getMenuItemsForAutocomplete } from '../../services/menuService';

const SearchBar = ({ onSearch, placeholder = "Search menu items..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchBarRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current && 
        !searchBarRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 1) {
        setLoading(true);
        try {
          const data = await getMenuItemsForAutocomplete(query);
          setSuggestions(data.data.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (err) {
          console.error('Failed to fetch suggestions', err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 1) {
        fetchSuggestions();
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    // Navigate to the item detail page
    navigate(`/menu/${item._id}`);
  };

  return (
    <div className="relative max-w-2xl mx-auto" ref={searchBarRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-amber-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 rounded-full bg-[#2D1B0E] text-amber-50 placeholder-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-600 border border-amber-900/30"
            onFocus={() => query.length >= 1 && setShowSuggestions(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaTimes className="text-amber-400 hover:text-amber-300" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors"
        >
          <FaSearch className="text-sm" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-[#2D1B0E] rounded-xl border border-amber-900/30 shadow-xl max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-amber-400 text-center">Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSuggestionClick(item)}
                className="p-4 border-b border-amber-900/30 last:border-b-0 hover:bg-amber-900/20 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-amber-50">{item.name}</div>
                    <div className="text-amber-400 text-sm">₹{item.price}</div>
                  </div>
                </div>
              </div>
            ))
          ) : query.length >= 1 ? (
            <div className="p-4 text-amber-100/80 text-center">No items found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;