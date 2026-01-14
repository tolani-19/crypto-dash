import React, { useState } from 'react';
import { Wallet, X, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

const PortfolioIcon = () => {
  const { purchasePrices, getPortfolioSummary } = usePortfolio();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const portfolioSummary = getPortfolioSummary();
  const totalItems = portfolioSummary.totalItems;

  return (
    <>
      <div className="portfolio-icon-container">
        <button
          className="portfolio-button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowModal(true)}
        >
          <Wallet className="portfolio-icon" />
          <span>Portfolio</span>
          {totalItems > 0 && (
            <span className="portfolio-badge">
              {totalItems}
            </span>
          )}
        </button>

        {showTooltip && totalItems > 0 && (
          <div className="portfolio-tooltip">
            <h3>Your Portfolio</h3>
            <p>
              Tracking {totalItems} coin{totalItems !== 1 ? 's' : ''}
            </p>
            <div className="tooltip-footer">
              <p>
                Click to view your portfolio
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Modal */}
      {showModal && (
        <div className="portfolio-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <h2>📊 Your Portfolio</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="portfolio-modal-close"
              >
                <X size={20} />
              </button>
            </div>
            
            {totalItems === 0 ? (
              <div className="portfolio-empty">
                <Wallet size={48} style={{ color: '#8b949e', marginBottom: '16px' }} />
                <h3>No coins in portfolio</h3>
                <p>Add purchase prices to track your investments!</p>
              </div>
            ) : (
              <div className="portfolio-modal-content">
                <div className="portfolio-stats">
                  <div className="portfolio-stat">
                    <span className="stat-label">Total Coins</span>
                    <span className="stat-value">{totalItems}</span>
                  </div>
                  <div className="portfolio-stat">
                    <span className="stat-label">Status</span>
                    <span className="stat-value active">Active</span>
                  </div>
                </div>
                
                <h3 style={{ margin: '20px 0 10px 0', color: '#ffffff' }}>
                  Your Holdings
                </h3>
                
                <div className="portfolio-list">
                  {Object.entries(purchasePrices).map(([coinId, data]) => {
                    const isObjectFormat = typeof data === 'object' && data !== null;
                    const coinName = isObjectFormat ? data.name : coinId;
                    const coinSymbol = isObjectFormat ? data.symbol : coinId;
                    const purchasePrice = isObjectFormat ? data.price : data;
                    
                    return (
                      <div key={coinId} className="portfolio-item">
                        <div className="portfolio-item-info">
                          <div className="portfolio-coin-details">
                            <span className="portfolio-coin-name">
                              {coinName}
                            </span>
                            <span className="portfolio-coin-symbol">
                              {coinSymbol.toUpperCase()}
                            </span>
                          </div>
                          <div className="portfolio-price-details">
                            <span className="portfolio-price">
                              ${typeof purchasePrice === 'number' ? purchasePrice.toFixed(2) : purchasePrice}
                            </span>
                            <span className="portfolio-date">
                              {isObjectFormat && data.timestamp 
                                ? new Date(data.timestamp).toLocaleDateString() 
                                : 'Added'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="portfolio-modal-footer">
                  <small>
                    💡 Purchase prices are saved locally in your browser
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioIcon;