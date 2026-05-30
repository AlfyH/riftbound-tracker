import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../styles/PointsSplitCard.css';
import { renderValue } from '../utils/renderValue';

type FeedbackType = '+1' | '-1' | null;

interface HalfProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  flipped?: boolean;
  subtitle?: string;
}

const Half: React.FC<HalfProps> = ({
  value, onIncrement, onDecrement, onReset, flipped, subtitle,
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const lastTapRef = useRef(0);
  const wasSwipingRef = useRef(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFeedback = (type: '+1' | '-1') => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback(type);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 600);
  };

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
  };

  const handleIncrement = () => { onIncrement(); triggerFeedback('+1'); vibrate(); };
  const handleDecrement = () => { if (value <= 0) return; onDecrement(); triggerFeedback('-1'); vibrate(); };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      wasSwipingRef.current = true;
      if (flipped) { handleDecrement(); } else { handleIncrement(); }
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    onSwipedDown: () => {
      wasSwipingRef.current = true;
      if (flipped) { handleIncrement(); } else { handleDecrement(); }
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
    delta: 15,
  });

  const handleTap = () => {
    if (wasSwipingRef.current) return;
    const now = Date.now();
    const gap = now - lastTapRef.current;
    if (gap < 350 && gap > 0) {
      lastTapRef.current = 0;
      onReset();
      vibrate();
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      {...swipeHandlers}
      className={`split-half${flipped ? ' split-half--flipped' : ''}`}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === '+') handleIncrement();
        if (e.key === 'ArrowDown' || e.key === '-') handleDecrement();
      }}
      aria-label={`Points: ${value}. Swipe up to add, swipe down to subtract, double-tap to reset.`}
    >
      <div className="split-half__right">
        <span key={value} className="tracker-value">{renderValue(value)}</span>
      </div>
      <div className="split-half__bottom-info">
        {subtitle && <span className="tracker-subtitle">{subtitle}</span>}
      </div>
      {feedback !== null && (
        <span className={`tracker-feedback tracker-feedback--${feedback === '+1' ? 'plus' : 'minus'}`}>
          {feedback}
        </span>
      )}
    </div>
  );
};

export interface PointsSplitCardProps {
  p1Value: number;
  p2Value: number;
  onIncrementP1: () => void;
  onDecrementP1: () => void;
  onResetP1: () => void;
  onIncrementP2: () => void;
  onDecrementP2: () => void;
  onResetP2: () => void;
  subtitle: string;
  subtitle2: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const PointsSplitCard: React.FC<PointsSplitCardProps> = ({
  p1Value, p2Value,
  onIncrementP1, onDecrementP1, onResetP1,
  onIncrementP2, onDecrementP2, onResetP2,
  subtitle, subtitle2, collapsed, onToggleCollapse,
}) => (
  <div className={`tracker-card tracker-card--large points-split-card${collapsed ? ' tracker-card--collapsed' : ''}`}>
    <button
      className="tracker-card__collapse-btn"
      onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}
      type="button"
      aria-label={collapsed ? 'Expand Points' : 'Collapse Points'}
    >
      {collapsed ? '▶' : '▼'}
    </button>
    {collapsed ? (
      <span className="tracker-label tracker-label--collapsed">Points</span>
    ) : (
      <>
        <Half
          value={p2Value}
          onIncrement={onIncrementP2}
          onDecrement={onDecrementP2}
          onReset={onResetP2}
          flipped
          subtitle={subtitle2}
        />
        <div className="points-split-card__divider" />
        <Half
          value={p1Value}
          onIncrement={onIncrementP1}
          onDecrement={onDecrementP1}
          onReset={onResetP1}
          subtitle={subtitle}
        />
        <span className="points-split-card__sideways-label">Points</span>
      </>
    )}
  </div>
);

export default PointsSplitCard;
