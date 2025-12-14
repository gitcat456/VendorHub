import React, { useState } from 'react';
import { Search } from 'lucide-react';

const HeroSearch = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Navigate to modify search or filter
        window.location.href = `/search?q=${query}`;
    };

    return (
        <div className="hero-search-container">
            <div className="container">
                <h1 className="hero-title">Find anything in <span className="highlight">Kenya</span></h1>
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="I am looking for..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary search-btn">Search</button>
                </form>
            </div>
            <style>{`
        .hero-search-container {
          background: linear-gradient(135deg, var(--primary-color) 0%, #1b5e20 100%);
          padding: 60px 0;
          text-align: center;
          color: white;
          margin-bottom: var(--spacing-xl);
        }
        .hero-title {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-lg);
          font-weight: 800;
        }
        .highlight {
          color: var(--secondary-color);
        }
        .search-form {
          display: flex;
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 8px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
        }
        .search-icon {
            color: var(--text-secondary);
            margin-right: var(--spacing-sm);
        }
        .search-form input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 1rem;
          padding: 8px 0;
        }
        .search-btn {
          padding: 0 32px;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }
        @media (max-width: 768px) {
           .hero-title {
             font-size: 1.8rem;
           }
           .hero-search-container {
             padding: 40px 0;
           }
        }
      `}</style>
        </div>
    );
};

export default HeroSearch;
