import React, { useEffect, useState } from 'react';
import TrackerCard from './TrackerCard';
import DisplayCard from './DisplayCard';
import type { GameState } from '../App';

interface ResourceLayoutProps {
  state: GameState;
  onIncrement: (key: keyof GameState) => void;
  onDecrement: (key: keyof GameState) => void;
  onResetTracker: (key: keyof GameState) => void;
  onOpenHelp: () => void;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 5) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  if (mins < 60) return remSecs > 0 ? `${mins}m ${remSecs}s ago` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m ago` : `${hrs}h ago`;
}

const ResourceLayout: React.FC<ResourceLayoutProps> = ({
  state,
  onIncrement,
  onDecrement,
  onResetTracker,
  onOpenHelp,
}) => {
  const [lastChanged, setLastChanged] = useState(() => new Date());
  const [, setTick] = useState(0);
  const [pointsCollapsed, setPointsCollapsed] = useState(false);
  const [xpCollapsed, setXpCollapsed] = useState(false);
  const [floatingCollapsed, setFloatingCollapsed] = useState(false);

  // Record when points value changes
  const prevPointsRef = React.useRef(state.points);
  if (prevPointsRef.current !== state.points) {
    prevPointsRef.current = state.points;
    setLastChanged(new Date());
  }

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="resource-layout">
      <div className="resource-layout__cards">
        <TrackerCard
          label="Points"
          value={state.points}
          onIncrement={() => onIncrement('points')}
          onDecrement={() => onDecrement('points')}
          onReset={() => onResetTracker('points')}
          size="large"
          subtitle={`Updated ${timeAgo(lastChanged)}`}
          onHelp={onOpenHelp}
          collapsed={pointsCollapsed}
          onToggleCollapse={() => setPointsCollapsed((v) => !v)}
        />

        <div className={`floating-group${floatingCollapsed ? ' floating-group--collapsed' : ''}`}>
          <div className="floating-group__header">
            <button
              className="floating-group__collapse-btn"
              onClick={() => setFloatingCollapsed((v) => !v)}
              type="button"
              aria-label={floatingCollapsed ? 'Expand Floating' : 'Collapse Floating'}
            >
              {floatingCollapsed ? '▶' : '▼'}
            </button>
            <span className="floating-group__label">Floating</span>
          </div>
          {!floatingCollapsed && (
            <div className="floating-group__row">
              <TrackerCard
                label="Energy"
                value={state.energy}
                onIncrement={() => onIncrement('energy')}
                onDecrement={() => onDecrement('energy')}
                onReset={() => onResetTracker('energy')}
                accent="orange"
              />
              <TrackerCard
                label="Power"
                value={state.power}
                onIncrement={() => onIncrement('power')}
                onDecrement={() => onDecrement('power')}
                onReset={() => onResetTracker('power')}
                accent="red"
              />
            </div>
          )}
        </div>
        <TrackerCard
          label="XP"
          value={state.xp}
          onIncrement={() => onIncrement('xp')}
          onDecrement={() => onDecrement('xp')}
          onReset={() => onResetTracker('xp')}
          accent="yellow"
          collapsed={xpCollapsed}
          onToggleCollapse={() => setXpCollapsed((v) => !v)}
        />
        <div className="resource-layout__row">
          <DisplayCard
            label="Total Energy"
            value={state.energy + state.runes}
          />
          <TrackerCard
            label="Rune Count"
            value={state.runes}
            onIncrement={() => onIncrement('runes')}
            onDecrement={() => onDecrement('runes')}
            onReset={() => onResetTracker('runes')}
            accent="grey"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceLayout;
