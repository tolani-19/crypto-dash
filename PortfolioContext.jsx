import React, { createContext, useState, useContext } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [purchasePrices, setPurchasePrices] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto-purchase-prices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  
  const setPurchasePrice = (coinId, price, coinData = {}) => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      console.error('Invalid price:', price);
      return false;
    }
    
    setPurchasePrices(prev => {
      const updated = { 
        ...prev, 
        [coinId]: {
          price: parsedPrice,
          name: coinData.name || coinId,
          symbol: coinData.symbol || coinId,
          timestamp: new Date().toISOString()
        }
      };
      try {
        localStorage.setItem('crypto-purchase-prices', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
      return updated;
    });
    return true;
  };

  const deletePurchasePrice = (coinId) => {
    setPurchasePrices(prev => {
      const updated = { ...prev };
      delete updated[coinId];
      try {
        localStorage.setItem('crypto-purchase-prices', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to delete from localStorage:', error);
      }
      return updated;
    });
  };

  const getProfitLoss = (coin, currentPrice) => {
    const purchaseData = purchasePrices[coin.id];
    if (!purchaseData) return null;
    
    const purchasePrice = purchaseData.price;
    const profitLossPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    
    return {
      percent: parseFloat(profitLossPercent.toFixed(2)),
      isProfit: profitLossPercent >= 0
    };
  };

  
  const getPortfolioSummary = () => {
    return {
      totalItems: Object.keys(purchasePrices).length,
      coins: purchasePrices
    };
  };

  return (
    <PortfolioContext.Provider value={{ 
      purchasePrices, 
      setPurchasePrice,
      deletePurchasePrice,
      getProfitLoss,
      getPortfolioSummary
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;