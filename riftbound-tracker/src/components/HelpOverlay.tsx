import React, { useEffect, useRef, useState } from 'react';
import type { ActionEntry } from '../App';
import './HelpOverlay.css';

interface HelpOverlayProps {
  onClose: () => void;
  playerCount: number;
  onSetPlayerCount: (n: number) => void;
  history: ActionEntry[];
  onClearHistory: () => void;
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

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose, playerCount, onSetPlayerCount, history, onClearHistory }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<'help' | 'history'>('help');

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="help-overlay"
      onClose={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
      aria-label="Interactions help"
    >
      <div className="help-overlay__panel">
        <div className="help-overlay__header">
          <span className="help-overlay__title">Menu</span>
          <button className="help-overlay__close" onClick={onClose} type="button" aria-label="Close help">✕</button>
        </div>
        <div className="help-overlay__tabs">
          <button
            className={`help-overlay__tab${tab === 'help' ? ' help-overlay__tab--active' : ''}`}
            onClick={() => setTab('help')}
            type="button"
          >How to use</button>
          <button
            className={`help-overlay__tab${tab === 'history' ? ' help-overlay__tab--active' : ''}`}
            onClick={() => setTab('history')}
            type="button"
          >History {history.length > 0 && <span className="help-overlay__tab-badge">{history.length}</span>}</button>
        </div>

        {tab === 'help' && (<>
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
        </>)}

        {tab === 'history' && (
          <div className="help-overlay__history">
            {history.length === 0 ? (
              <p className="help-overlay__history-empty">No actions yet.</p>
            ) : (<>
              <button className="help-overlay__history-clear" onClick={onClearHistory} type="button">Clear</button>
              <ul className="help-overlay__history-list">
                {history.map((entry, i) => (
                  <li key={i} className={`help-overlay__history-item help-overlay__history-item--${entry.action === '+1' ? 'plus' : entry.action === '-1' ? 'minus' : 'reset'}`}>
                    <span className="help-overlay__history-action">{entry.action === '+1' ? '+1' : entry.action === '-1' ? '−1' : '↺'}</span>
                    <span className="help-overlay__history-label">{entry.label}</span>
                    <span className="help-overlay__history-value">{entry.from} → {entry.value}</span>
                    <span className="help-overlay__history-time">{entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </li>
                ))}
              </ul>
            </>)}
          </div>
        )}

        <div className="help-overlay__credit">
          Made by Alfy Hushairi &middot; <a href="https://anadillo.co.uk" target="_blank" rel="noopener noreferrer">anadillo.co.uk</a>
        </div>
        <div className="help-overlay__credit">
          <a href="https://piltoverarchive.com/decks/view/9f77003d-640e-4ed9-8fa3-a5b3ef91315e" target="_blank" rel="noopener noreferrer">My Deck List</a>
        </div>
      </div>
    </dialog>
  );
};

export default HelpOverlay;
