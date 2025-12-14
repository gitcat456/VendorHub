import React from 'react';
import { CATEGORIES } from '../data/mockData';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
    return (
        <div className="container category-section">
            <h2 className="section-title">Browse Categories</h2>
            <div className="category-grid">
                {CATEGORIES.map((cat) => {
                    const IconComponent = Icons[cat.icon] || Icons.HelpCircle;
                    return (
                        <Link to={`/category/${cat.id}`} key={cat.id} className="category-card">
                            <div className="icon-wrapper" style={{ backgroundColor: cat.color }}>
                                <IconComponent size={24} color="#333" />
                            </div>
                            <span className="category-name">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
            <style>{`
        .category-section {
            margin-bottom: var(--spacing-xl);
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: var(--spacing-md);
        }
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .category-card:hover {
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-sm);
        }
        .category-name {
          font-size: var(--font-size-sm);
          font-weight: 500;
          text-align: center;
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

export default CategoryGrid;
