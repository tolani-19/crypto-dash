import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ProfitLossIndicator = ({ profitLoss, showDetails = false, size = 'medium' }) => {
  if (!profitLoss) return null;

  const { amount, percentage, isProfit } = profitLoss;
  
  const sizeClass = size === 'small' ? 'pl-indicator-small' : 
                   size === 'large' ? 'pl-indicator-large' : 'pl-indicator';
  
  const colorClass = isProfit ? 'pl-profit' : 'pl-loss';

  return (
    <div className={`pl-indicator ${sizeClass} ${colorClass}`}>
      {isProfit ? (
        <TrendingUp className="pl-icon" />
      ) : (
        <TrendingDown className="pl-icon" />
      )}
      <span className="pl-percentage">
        {isProfit ? '+' : ''}{percentage}%
      </span>
      {showDetails && (
        <span className="pl-amount">
          (${isProfit ? '+' : ''}{amount.toFixed(2)})
        </span>
      )}
    </div>
  );
};

export default ProfitLossIndicator;