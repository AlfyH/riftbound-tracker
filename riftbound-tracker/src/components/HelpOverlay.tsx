import React from 'react';
import './HelpOverlay.css';

interface HelpOverlayProps {
  onClose: () => void;
}

const INTERACTIONS = [
  { gesture: 'Swipe Up', description: 'Increment value by 1' },
  { gesture: 'Swipe Down', description: 'Decrement value by 1 (min 0)' },
  { gesture: 'Double Tap', description: 'Reset that tracker to 0' },
  { gesture: '▼ / ▶ Button', description: 'Collapse or expand a tracker card' },
  { gesture: 'Available Energy', description: 'Auto-calculated: Floating Energy + Rune Count' },
  { gesture: 'Points timestamp', description: 'Shows how long ago Points was last changed' },
];

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => (
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
    </div>
  </div>
);

export default HelpOverlay;
