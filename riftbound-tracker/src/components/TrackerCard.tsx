import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../styles/TrackerCard.css';

export interface TrackerCardProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  size?: 'large' | 'normal';
  accent?: 'red' | 'orange' | 'yellow' | 'grey';
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
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const lastTapTimeRef = useRef<number>(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasSwipingRef = useRef(false);

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
      wasSwipingRef.current = true;
      handleIncrement();
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    onSwipedDown: () => {
      wasSwipingRef.current = true;
      handleDecrement();
      setTimeout(() => { wasSwipingRef.current = false; }, 100);
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
    delta: 15,
  });

  const cardClass = [
    'tracker-card',
    size === 'large' ? 'tracker-card--large' : '',
    accent === 'red' ? 'tracker-card--red' : '',
    accent === 'orange' ? 'tracker-card--orange' : '',
    accent === 'yellow' ? 'tracker-card--yellow' : '',
    accent === 'grey' ? 'tracker-card--grey' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...swipeHandlers}
      className={cardClass}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === '+') handleIncrement();
        if (e.key === 'ArrowDown' || e.key === '-') handleDecrement();
        if (e.key === 'Enter' || e.key === ' ') handleTap();
      }}
      aria-label={`${label}: ${value}. Swipe up to add, swipe down to subtract, double-tap to reset.`}
    >
      <div className="tracker-card__left">
        <span className="tracker-label">{label}</span>
        <span className="tracker-hint">↑ swipe ↓</span>
      </div>
      <div className="tracker-card__right">
        {/* Changing `key` on value restarts the CSS pop animation on each update */}
        <span key={value} className="tracker-value">
          {value}
        </span>
      </div>

      {feedback !== null && (
        <span
          className={`tracker-feedback tracker-feedback--${feedback === '+1' ? 'plus' : 'minus'}`}
        >
          {feedback}
        </span>
      )}
    </div>
  );
};

export default TrackerCard;
