import React from 'react';
import './HelpOverlay.css';

interface HelpOverlayProps {
  onClose: () => void;
  playerCount: number;
  onSetPlayerCount: (n: number) => void;
}

const INTERACTIONS = [
  { gesture: 'Swipe Up', description: 'Increment value by 1' },
  { gesture: 'Swipe Down', description: 'Decrement value by 1 (min 0)' },
  { gesture: 'Double Tap', description: 'Reset that tracker to 0' },
  { gesture: '▼ / ▶ Button', description: 'Collapse or expand a tracker card' },
  { gesture: '⇅ Button', description: 'Flip a player counter orientation (3P+ mode)' },
  { gesture: 'Player Name', description: 'Tap the name field to label each player (3P+ mode)' },
  { gesture: '? Button', description: 'Open this help screen' },
  { gesture: 'Timestamps', description: 'Show how long ago each tracker was last changed' },
];

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose, playerCount, onSetPlayerCount }) => (
  <div className="help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Interactions help">
    <div className="help-overlay__panel" onClick={(e) => e.stopPropagation()}>
      <div className="help-overlay__header">
        <span className="help-overlay__title">How to use</span>
        <button className="help-overlay__close" onClick={onClose} type="button" aria-label="Close help">✕</button>
      </div>
      <ul className="help-overlay__list">
        {INTERACTIONS.map(({ gesture, description }) => (
          <li key={gesture} className="help-overlay__item">
            <span className="help-overlay__gesture">{gesture}</span>
            <span className="help-overlay__desc">{description}</span>
          </li>
        ))}
      </ul>
      <div className="help-overlay__actions">
        <div className="help-overlay__section-label">Players</div>
        <div className="help-overlay__player-select">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`help-overlay__player-count-btn${playerCount === n ? ' help-overlay__player-count-btn--active' : ''}`}
              onClick={() => onSetPlayerCount(n)}
              type="button"
            >
              {n}P
            </button>
          ))}
        </div>
      </div>
      <div className="help-overlay__credit">
        Made by Alfy Hushairi &middot; <a href="https://anadillo.co.uk" target="_blank" rel="noopener noreferrer">anadillo.co.uk</a>
      </div>
    </div>
  </div>
);

export default HelpOverlay;
