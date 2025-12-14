import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>About Us</h3>
                        <p>The best place to buy and sell anything.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">Help & Support</a></li>
                            <li><a href="#">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} MarketPlace. All rights reserved.
                </div>
            </div>
            <style>{`
        .site-footer {
          background-color: #263238;
          color: #eceff1;
          padding: var(--spacing-xl) 0;
          margin-top: auto;
        }
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }
        .footer-section h3 {
          color: var(--bg-white);
          margin-bottom: var(--spacing-md);
        }
        .footer-section a {
          color: #b0bec5;
        }
        .footer-section a:hover {
          color: var(--bg-white);
        }
        .footer-bottom {
          text-align: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid #37474f;
          color: #90a4ae;
          font-size: var(--font-size-sm);
        }
      `}</style>
        </footer>
    );
};

export default Footer;
