
import React from 'react';
import { SentimentLabel } from '../types';

interface SentimentBadgeProps {
  sentiment: SentimentLabel;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const sentimentStyles = {
    [SentimentLabel.Positive]: 'bg-green-500/20 text-green-300 border-green-500/30',
    [SentimentLabel.Negative]: 'bg-red-500/20 text-red-300 border-red-500/30',
    [SentimentLabel.Neutral]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    [SentimentLabel.Error]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full border ${sentimentStyles[sentiment]}`}
    >
      {sentiment}
    </span>
  );
};

export default SentimentBadge;
