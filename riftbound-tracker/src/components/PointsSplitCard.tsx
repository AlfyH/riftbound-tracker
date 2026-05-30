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
  onFlip?: () => void;
  subtitle?: string;
  defaultName?: string;
}

const Half: React.FC<HalfProps> = ({
  value, onIncrement, onDecrement, onReset, flipped, onFlip, subtitle, defaultName = '',
}) => {
  const [playerName, setPlayerName] = useState(defaultName);
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
  const handleDecrement = () => {
    if (value <= 0) return;
    onDecrement();
    triggerFeedback('-1');
    vibrate();
  };

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
    trackMouse: true,
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
      tabIndex={0}
      role="group"
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === '+') handleIncrement();
        if (e.key === 'ArrowDown' || e.key === '-') handleDecrement();
      }}
      aria-label={`Points: ${value}. Arrow up/+ to add, arrow down/− to subtract, double-tap to reset.`}
    >
      <input
        className="split-half__name-input"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        placeholder="Name"
        maxLength={20}
        type="text"
        aria-label="Player name"
      />
      <div className="split-half__right">
        <div className="split-half__number-wrap">
          <span key={value} className="tracker-value">{renderValue(value)}</span>
        </div>
      </div>
      <div className="split-half__bottom-info">
        {subtitle && <span className="tracker-subtitle">{subtitle}</span>}
      </div>
      {onFlip && (
        <button
          className="split-half__flip-btn"
          onClick={(e) => { e.stopPropagation(); onFlip(); }}
          type="button"
          aria-label="Flip orientation"
        >
          ⇅
        </button>
      )}
      {feedback !== null && (
        <span className={`tracker-feedback tracker-feedback--${feedback === '+1' ? 'plus' : 'minus'}`}>
          {feedback}
        </span>
      )}
    </div>
  );
};

export interface PointsSplitCardProps {
  values: number[];
  onIncrements: (() => void)[];
  onDecrements: (() => void)[];
  onResets: (() => void)[];
  subtitles: string[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const PointsSplitCard: React.FC<PointsSplitCardProps> = ({
  values, onIncrements, onDecrements, onResets, subtitles, collapsed, onToggleCollapse,
}) => {
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    () => values.map((_, i) => i >= Math.ceil(values.length / 2))
  );

  const toggleFlip = (idx: number) => {
    setFlippedStates((prev) => prev.map((v, i) => i === idx ? !v : v));
  };

  const showFlipBtn = values.length >= 3;

  return (
  <div className={`tracker-card tracker-card--large points-split-card${collapsed ? ' tracker-card--collapsed' : ''}${values.length === 4 ? ' points-split-card--four-player' : ''}`}>
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
        {[...values].reverse().map((val, revIdx) => {
          const idx = values.length - 1 - revIdx;
          const isLast = revIdx === values.length - 1;
          return (
            <React.Fragment key={idx}>
              <Half
                value={val}
                onIncrement={onIncrements[idx]}
                onDecrement={onDecrements[idx]}
                onReset={onResets[idx]}
                flipped={flippedStates[idx]}
                onFlip={showFlipBtn ? () => toggleFlip(idx) : undefined}
                subtitle={subtitles[idx]}
              />
              {!isLast && <div className="points-split-card__divider" />}
            </React.Fragment>
          );
        })}
        <span className={`points-split-card__sideways-label${values.length >= 3 ? ' points-split-card__sideways-label--bottom' : ''}${(flippedStates[0] || (values.length === 4 && flippedStates[1])) ? ' points-split-card__sideways-label--faded' : ''}`}>Points</span>
      </>
    )}
  </div>
  );
};

export default PointsSplitCard;
