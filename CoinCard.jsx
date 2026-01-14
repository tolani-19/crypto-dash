import React, { useState } from 'react';
import { Link } from 'react-router';
import { usePortfolio } from './PortfolioContext';

const CoinCard = ({ coin }) => {
  const { purchasePrices, setPurchasePrice, deletePurchasePrice, getProfitLoss } = usePortfolio();
  const [showInput, setShowInput] = useState(false);
  const [inputPrice, setInputPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const purchaseData = purchasePrices[coin.id];
  const purchasePrice = purchaseData?.price || purchaseData; 
  const profitLoss = purchasePrice ? getProfitLoss(coin, coin.current_price) : null;
  
 
  const getBorderClass = () => {
    if (!purchasePrice) return '';
    if (!profitLoss) return '';
    return profitLoss.isProfit ? 'profit-border' : 'loss-border';
  };

  
  const handleSavePrice = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputPrice || inputPrice.trim() === '') {
      alert('Please enter a purchase price');
      return;
    }
    
    const price = parseFloat(inputPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    
    
    if (setPurchasePrice(coin.id, price, {
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      currentPrice: coin.current_price
    })) {
      setShowInput(false);
      setIsEditing(false);
      setInputPrice('');
    }
  };

  
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInput(true);
    setIsEditing(true);
    setInputPrice(purchasePrice || '');
  };

  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete purchase price for ${coin.name}?`)) {
      deletePurchasePrice(coin.id);
      setShowInput(false);
      setIsEditing(false);
    }
  };

  
  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInput(false);
    setIsEditing(false);
    setInputPrice('');
  };

  
  const handleAddPrice = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInput(true);
    setIsEditing(false);
    setInputPrice('');
  };

 
  const formatPurchasePrice = () => {
    if (!purchasePrice) return '';
    if (typeof purchasePrice === 'number') {
      return purchasePrice.toFixed(2);
    }
    if (purchaseData?.price) {
      return purchaseData.price.toFixed(2);
    }
    return '';
  };

  return (
    <div className={`coin-card ${getBorderClass()}`}>
      <div className="coin-header">
        <img src={coin.image} alt={coin.name} className="coin-image" />
        <div>
          <h2>{coin.name}</h2>
          <p className="symbol">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>
      
      {/* Coin Details - Link to details page */}
      <Link to={`/coin/${coin.id}`} className="coin-details-link">
        <p>Price: ${coin.current_price.toLocaleString()}</p>
        <p className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
          24h: {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
        </p>
        <p>Market Cap: {coin.market_cap.toLocaleString()}</p>
      </Link>
      
      {/* Purchase Price Section */}
      <div className="purchase-section">
        {showInput ? (
          <div className="price-input" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginBottom: '10px', color: '#c9d1d9' }}>
              {isEditing ? 'Edit Purchase Price' : 'Add Purchase Price'}
            </h4>
            <input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              placeholder="Enter your purchase price in USD"
              className="price-input-field"
              step="0.000001"
              min="0"
              autoFocus
            />
            <div className="price-input-buttons" style={{ marginTop: '15px' }}>
              <button onClick={handleSavePrice} className="save-btn">
                {isEditing ? 'Update' : 'Save'}
              </button>
              {isEditing && (
                <button onClick={handleDelete} className="delete-btn" style={{
                  background: '#d92d20',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flex: 1
                }}>
                  Delete
                </button>
              )}
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : purchasePrice ? (
          <div className="purchase-info">
            <div className="purchase-details">
              <span className="purchase-label">Your purchase:</span>
              <span className="purchase-price">${formatPurchasePrice()}</span>
              {profitLoss && (
                <span className={`pl-indicator ${profitLoss.isProfit ? 'profit' : 'loss'}`}>
                  {profitLoss.isProfit ? '▲' : '▼'}
                  {profitLoss.isProfit ? '+' : ''}{profitLoss.percent}%
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={handleEdit}
                className="edit-price-btn"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="edit-price-btn"
                style={{ 
                  background: 'rgba(217, 45, 32, 0.1)',
                  color: '#d92d20',
                  borderColor: '#d92d20'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleAddPrice}
            className="add-price-btn"
          >
            <span className="add-price-icon">+</span>
            <span className="add-price-text">Add your purchase price</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CoinCard;