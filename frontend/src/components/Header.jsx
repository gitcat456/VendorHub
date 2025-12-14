import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Menu } from 'lucide-react';
// import '../features/HeroSearch.css'; // Removed invalid import

const Header = () => {
    return (
        <header className="site-header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    MarketPlace
                </Link>

                {/* Mobile Search & Menu (Hidden on desktop initially, but we'll adapt) */}
                <div className="header-actions">
                    <Link to="/post" className="btn btn-secondary">
                        <PlusCircle size={18} style={{ marginRight: '8px' }} />
                        <span>Sell</span>
                    </Link>
                </div>
            </div>
            <style>{`
        .site-header {
          background-color: var(--bg-white);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-sm) 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-color);
          letter-spacing: -0.5px;
        }
        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }
      `}</style>
        </header>
    );
};

export default Header;
