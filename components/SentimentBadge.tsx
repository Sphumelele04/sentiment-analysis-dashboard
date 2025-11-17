
import React from 'react';
import { SentimentLabel } from '../types';

interface SentimentBadgeProps {
  sentiment: SentimentLabel;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const sentimentStyles = {
    [SentimentLabel.Positive]: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-500/30',
    [SentimentLabel.Negative]: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-500/30',
    [SentimentLabel.Neutral]: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-500/30',
    [SentimentLabel.Error]: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-500/30',
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
