import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../styles/TrackerCard.css';
import { renderValue } from '../utils/renderValue';

export interface TrackerCardProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  size?: 'large' | 'normal';
  accent?: 'red' | 'orange' | 'yellow' | 'grey';
  subtitle?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onHelp?: () => void;
  onAddPlayer?: () => void;
  onBoardReset?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  flipped?: boolean;
}

type FeedbackType = '+1' | '-1' | null;

const TrackerCard: React.FC<TrackerCardProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  onReset,
  size = 'normal',
  accent,
  subtitle,
  collapsed = false,
  onToggleCollapse,
  onHelp,
  onAddPlayer,
  onBoardReset,
  onUndo,
  canUndo = false,
  flipped = false,
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [flashSub, setFlashSub] = useState<string | null>(null);
  const [flashSubKey, setFlashSubKey] = useState(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashSubTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashSubSchedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasSwipingRef = useRef(false);

  const showFlash = (text: string, subtext?: string) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (flashSubTimerRef.current) clearTimeout(flashSubTimerRef.current);
    if (flashSubSchedulerRef.current) clearTimeout(flashSubSchedulerRef.current);
    setFlash(text);
    setFlashKey(k => k + 1);
    setFlashSub(null);
    flashTimerRef.current = setTimeout(() => setFlash(null), 1100);
    if (subtext) {
      flashSubSchedulerRef.current = setTimeout(() => {
        setFlashSub(subtext);
        setFlashSubKey(k => k + 1);
        flashSubTimerRef.current = setTimeout(() => setFlashSub(null), 900);
      }, 380);
    }
  };

  const triggerFeedback = (type: '+1' | '-1') => {
    if (feedbackTimerRef.current !== null) clearTimeout(feedbackTimerRef.current);
    setFeedback(type);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 600);
  };

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handleIncrement = () => {
    onIncrement();
    triggerFeedback('+1');
    vibrate();
  };

  const handleDecrement = () => {
    if (value <= 0) return;
    onDecrement();
    triggerFeedback('-1');
    vibrate();
  };

  const handleTap = () => {
    // Suppress click that fires after a completed swipe
    if (wasSwipingRef.current) return;

    const now = Date.now();
    const gap = now - lastTapTimeRef.current;

    if (gap < 350 && gap > 0) {
      // Double-tap detected – reset this tracker
      lastTapTimeRef.current = 0;
      onReset();
      vibrate();
    } else {
      lastTapTimeRef.current = now;
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      if (collapsed) return;
      wasSwipingRef.current = true;
      if (flipped) { handleDecrement(); } else { handleIncrement(); }
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    onSwipedDown: () => {
      if (collapsed) return;
      wasSwipingRef.current = true;
      if (flipped) { handleIncrement(); } else { handleDecrement(); }
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    preventScrollOnSwipe: !collapsed,
    trackTouch: true,
    trackMouse: true,
    delta: 15,
  });

  const cardClass = [
    'tracker-card',
    size === 'large' ? 'tracker-card--large' : '',
    accent === 'red' ? 'tracker-card--red' : '',
    accent === 'orange' ? 'tracker-card--orange' : '',
    accent === 'yellow' ? 'tracker-card--yellow' : '',
    accent === 'grey' ? 'tracker-card--grey' : '',
    collapsed ? 'tracker-card--collapsed' : '',
    flipped ? 'tracker-card--flipped' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...swipeHandlers}
      className={cardClass}
      onClick={handleTap}
      tabIndex={0}
      role="group"
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === '+') handleIncrement();
        if (e.key === 'ArrowDown' || e.key === '-') handleDecrement();
        if (e.key === 'Enter' || e.key === ' ') handleTap();
      }}
      aria-label={`${label}: ${value}. Arrow up/+ to add, arrow down/− to subtract, double-tap or Enter to reset.`}
    >
      {onHelp && (
        <button
          className="tracker-card__help-btn"
          onClick={(e) => { e.stopPropagation(); showFlash('Menu'); onHelp(); }}
          aria-label="Show help"
          type="button"
        >
          ☰
        </button>
      )}
      {onBoardReset && (
        <button
          className="tracker-card__board-reset-btn"
          onClick={(e) => { e.stopPropagation(); showFlash('Reset all', 'Undo?'); onBoardReset(); }}
          aria-label="Reset all trackers"
          type="button"
        >
          ↺
        </button>
      )}
      {onUndo && (
        <button
          className="tracker-card__undo-btn"
          onClick={(e) => { e.stopPropagation(); if (canUndo) { showFlash('Undo'); onUndo(); } else { showFlash('Nothing to undo'); } }}
          aria-label="Undo last action"
          type="button"
          disabled={!canUndo}
        >
          ↶
        </button>
      )}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="tracker-card__sr-flash"
      >
        {flash ?? ''}
      </div>
      {(flash || flashSub) && (
        <div aria-hidden="true" className="tracker-card__screen-flash">
          {flash && <span className="tracker-card__screen-flash-label" key={flashKey}>{flash}</span>}
          {flashSub && <span className="tracker-card__screen-flash-sublabel" key={flashSubKey}>{flashSub}</span>}
        </div>
      )}
      {flashSub && (
        <div className="tracker-card__undo-arrow" key={`a${flashSubKey}`} />
      )}
      {onAddPlayer && (
        <button
          className="tracker-card__add-player-btn"
          onClick={(e) => { e.stopPropagation(); onAddPlayer(); }}
          aria-label="Add second player"
          type="button"
        >
          +
        </button>
      )}
      {onToggleCollapse && (
        <button
          className="tracker-card__collapse-btn"
          onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}
          aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
          type="button"
        >
          <span style={{ display: 'inline-block', transform: collapsed ? 'rotate(-90deg)' : undefined }}>▼</span>
        </button>
      )}
      {!collapsed && (
        <>
          <div className="tracker-card__left">
            <span className="tracker-label">{label}</span>
          </div>
          <div className="tracker-card__right">
            <span key={value} className="tracker-value">
              {renderValue(value)}
            </span>
          </div>
          <div className="tracker-card__bottom-info">
            {subtitle && <span className="tracker-subtitle">{subtitle}</span>}
          </div>
        </>
      )}
      {collapsed && (
        <span className="tracker-label tracker-label--collapsed">{label}</span>
      )}

      <span
        aria-live="polite"
        aria-atomic="true"
        className="tracker-card__sr-feedback"
      >
        {feedback !== null ? `${label} ${feedback === '+1' ? 'increased to' : 'decreased to'} ${value}` : ''}
      </span>
      {feedback !== null && (
        <span
          aria-hidden="true"
          className={`tracker-feedback tracker-feedback--${feedback === '+1' ? 'plus' : 'minus'}`}
        >
          {feedback}
        </span>
      )}
    </div>
  );
};

export default TrackerCard;
