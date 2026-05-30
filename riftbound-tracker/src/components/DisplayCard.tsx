import React from 'react';
import '../styles/TrackerCard.css';

interface DisplayCardProps {
  label: string;
  value: number;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ label, value }) => (
  <div className="tracker-card tracker-card--display">
    <div className="tracker-card__left">
      <span className="tracker-label">{label}</span>
      <span className="tracker-hint">auto-calc</span>
    </div>
    <div className="tracker-card__right">
      <span className="tracker-value">{value}</span>
    </div>
  </div>
);

export default DisplayCard;
