import React, { useEffect, useState } from 'react';
import TrackerCard from './TrackerCard';
import PointsSplitCard from './PointsSplitCard';
import type { GameState } from '../App';

interface ResourceLayoutProps {
  state: GameState;
  onIncrement: (key: keyof GameState) => void;
  onDecrement: (key: keyof GameState) => void;
  onResetTracker: (key: keyof GameState) => void;
  onOpenHelp: () => void;
  twoPlayer: boolean;
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
  twoPlayer,
}) => {
  const [lastChanged, setLastChanged] = useState(() => new Date());
  const [lastChanged2, setLastChanged2] = useState(() => new Date());
  const [lastChangedEnergy, setLastChangedEnergy] = useState(() => new Date());
  const [lastChangedPower, setLastChangedPower] = useState(() => new Date());
  const [lastChangedXp, setLastChangedXp] = useState(() => new Date());
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

  // Record when points2 value changes
  const prevPoints2Ref = React.useRef(state.points2);
  if (prevPoints2Ref.current !== state.points2) {
    prevPoints2Ref.current = state.points2;
    setLastChanged2(new Date());
  }

  const prevEnergyRef = React.useRef(state.energy);
  if (prevEnergyRef.current !== state.energy) {
    prevEnergyRef.current = state.energy;
    setLastChangedEnergy(new Date());
  }

  const prevPowerRef = React.useRef(state.power);
  if (prevPowerRef.current !== state.power) {
    prevPowerRef.current = state.power;
    setLastChangedPower(new Date());
  }

  const prevXpRef = React.useRef(state.xp);
  if (prevXpRef.current !== state.xp) {
    prevXpRef.current = state.xp;
    setLastChangedXp(new Date());
  }

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="resource-layout">
      <div className={`resource-layout__cards${twoPlayer ? ' resource-layout__cards--two-player' : ''}`}>
        {twoPlayer ? (
          <PointsSplitCard
            p1Value={state.points}
            p2Value={state.points2}
            onIncrementP1={() => onIncrement('points')}
            onDecrementP1={() => onDecrement('points')}
            onResetP1={() => onResetTracker('points')}
            onIncrementP2={() => onIncrement('points2')}
            onDecrementP2={() => onDecrement('points2')}
            onResetP2={() => onResetTracker('points2')}
            subtitle={`Updated ${timeAgo(lastChanged)}`}
            subtitle2={`Updated ${timeAgo(lastChanged2)}`}
            collapsed={pointsCollapsed}
            onToggleCollapse={() => setPointsCollapsed((v) => !v)}
          />
        ) : (
          <TrackerCard
            label="Points"
            value={state.points}
            onIncrement={() => onIncrement('points')}
            onDecrement={() => onDecrement('points')}
            onReset={() => onResetTracker('points')}
            size="large"
            subtitle={`Updated ${timeAgo(lastChanged)}`}
            collapsed={pointsCollapsed}
            onToggleCollapse={() => setPointsCollapsed((v) => !v)}
          />
        )}

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
                subtitle={`Updated ${timeAgo(lastChangedEnergy)}`}
              />
              <TrackerCard
                label="Power"
                value={state.power}
                onIncrement={() => onIncrement('power')}
                onDecrement={() => onDecrement('power')}
                onReset={() => onResetTracker('power')}
                accent="red"
                subtitle={`Updated ${timeAgo(lastChangedPower)}`}
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
          subtitle={`Updated ${timeAgo(lastChangedXp)}`}
          collapsed={xpCollapsed}
          onToggleCollapse={() => setXpCollapsed((v) => !v)}
          onHelp={onOpenHelp}
        />
      </div>
    </div>
  );
};

export default ResourceLayout;
