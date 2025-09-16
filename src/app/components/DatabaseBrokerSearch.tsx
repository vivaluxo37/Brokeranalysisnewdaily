'use client';

import { useState, useEffect, useRef } from 'react';
import { Broker } from '@/lib/db/schema';

interface SearchSuggestion {
  type: 'broker' | 'feature' | 'regulation' | 'platform';
  text: string;
  url?: string;
  subtitle?: string;
  filter?: string;
}

interface SearchFilters {
  minRating?: number;
  maxMinDeposit?: number;
  establishedYear?: number;
  regulatoryBody?: string;
  feature?: string;
  platform?: string;
}

interface DatabaseBrokerSearchProps {
  onResults?: (brokers: Broker[]) => void;
  onBrokerSelect?: (broker: Broker) => void;
  placeholder?: string;
  className?: string;
}

export default function DatabaseBrokerSearch({
  onResults,
  onBrokerSelect,
  placeholder = "Search brokers by name, features, or regulations...",
  className = ""
}: DatabaseBrokerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Broker[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('brokerSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '10',
      });

      // Add filters to params
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.maxMinDeposit) params.append('filters', JSON.stringify(filters));

      const response = await fetch(`/api/brokers/search?${params}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        setSuggestions(data.suggestions || []);

        if (onResults) {
          onResults(data.data);
        }

        // Add to search history
        if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
          const newHistory = [searchQuery.trim(), ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
          localStorage.setItem('brokerSearchHistory', JSON.stringify(newHistory));
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.url) {
      window.location.href = suggestion.url;
    } else if (suggestion.filter) {
      try {
        const filterObj = JSON.parse(suggestion.filter);
        setFilters(prev => ({ ...prev, ...filterObj }));
        setQuery(suggestion.text);
        setShowSuggestions(false);
      } catch (error) {
        setQuery(suggestion.text);
        setShowSuggestions(false);
      }
    } else {
      setQuery(suggestion.text);
      setShowSuggestions(false);
    }
  };

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setShowSuggestions(false);
    if (onBrokerSelect) {
      onBrokerSelect(broker);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedBroker(null);
    setFilters({});
    if (onResults) {
      onResults([]);
    }
  };

  const applyFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Search Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => applyFilter('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Min Deposit</label>
              <select
                value={filters.maxMinDeposit || ''}
                onChange={(e) => applyFilter('maxMinDeposit', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Deposit</option>
                <option value="100">Up to $100</option>
                <option value="250">Up to $250</option>
                <option value="500">Up to $500</option>
                <option value="1000">Up to $1,000</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {key}: {value}
                    <button
                      onClick={() => clearFilter(key as keyof SearchFilters)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {/* Search History */}
          {searchHistory.length > 0 && query.length === 0 && (
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Searches</h4>
              {searchHistory.map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(historyItem)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  {historyItem}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Suggestions</h4>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.text}</div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <div className="ml-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.type === 'broker' ? 'bg-blue-100 text-blue-800' :
                      suggestion.type === 'feature' ? 'bg-green-100 text-green-800' :
                      suggestion.type === 'regulation' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {suggestion.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
          </div>
          {results.map((broker) => (
            <div
              key={broker.id}
              onClick={() => handleBrokerSelect(broker)}
              className="px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                {broker.logo_url && (
                  <img
                    src={broker.logo_url}
                    alt={broker.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{broker.name}</h3>
                    <div className="flex items-center space-x-1">
                      {renderStars(broker.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {broker.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Min Deposit: ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency} •
                    Spread: {broker.spread_type}
                  </div>
                  {broker.short_description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {broker.short_description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
          <div className="text-center text-gray-600">
            No brokers found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}