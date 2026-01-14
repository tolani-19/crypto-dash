import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

const PortfolioManager = ({ coin, onClose }) => {
  const { portfolio, updateHolding } = usePortfolio();
  const [amount, setAmount] = useState(portfolio[coin.id]?.amount || 0);
  const [purchasePrice, setPurchasePrice] = useState(
    portfolio[coin.id]?.purchasePrice || coin.current_price
  );

  const handleSave = () => {
    updateHolding(coin.id, {
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  const currentValue = amount * coin.current_price;
  const purchaseValue = amount * purchasePrice;
  const profitLoss = currentValue - purchaseValue;
  const percentage = purchaseValue > 0 ? ((profitLoss / purchaseValue) * 100).toFixed(2) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Manage {coin.name} Holdings</h2>
          <button onClick={onClose} className="modal-close">
            <X className="icon" />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">
            Amount of {coin.symbol.toUpperCase()}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            step="0.000001"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Purchase Price per Coin (USD)
          </label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="form-input"
            step="0.01"
            min="0"
            placeholder={coin.current_price}
          />
        </div>

        {amount > 0 && (
          <div className="summary-box">
            <h3 className="summary-title">Summary</h3>
            <div className="summary-row">
              <span>Current Value:</span>
              <span className="font-semibold">${currentValue.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Purchase Value:</span>
              <span className="font-semibold">${purchaseValue.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Profit/Loss:</span>
              <span className={profitLoss >= 0 ? 'positive' : 'negative'}>
                ${profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} ({percentage}%)
              </span>
            </div>
          </div>
        )}

        <button onClick={handleSave} className="btn-primary">
          <Save className="icon" style={{ marginRight: '8px' }} />
          Save Holdings
        </button>

        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PortfolioManager;