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
  playerCount: number;
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
  playerCount,
}) => {
  const [lastChanged, setLastChanged] = useState(() => new Date());
  const [lastChanged2, setLastChanged2] = useState(() => new Date());
  const [lastChanged3, setLastChanged3] = useState(() => new Date());
  const [lastChanged4, setLastChanged4] = useState(() => new Date());
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

  const prevPoints3Ref = React.useRef(state.points3);
  if (prevPoints3Ref.current !== state.points3) {
    prevPoints3Ref.current = state.points3;
    setLastChanged3(new Date());
  }

  const prevPoints4Ref = React.useRef(state.points4);
  if (prevPoints4Ref.current !== state.points4) {
    prevPoints4Ref.current = state.points4;
    setLastChanged4(new Date());
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
      <div className={`resource-layout__cards${playerCount > 1 ? ' resource-layout__cards--two-player' : ''}`}>
        {playerCount > 1 ? (
          <PointsSplitCard
            values={[state.points, state.points2, state.points3, state.points4].slice(0, playerCount)}
            onIncrements={[
              () => onIncrement('points'),
              () => onIncrement('points2'),
              () => onIncrement('points3'),
              () => onIncrement('points4'),
            ].slice(0, playerCount)}
            onDecrements={[
              () => onDecrement('points'),
              () => onDecrement('points2'),
              () => onDecrement('points3'),
              () => onDecrement('points4'),
            ].slice(0, playerCount)}
            onResets={[
              () => onResetTracker('points'),
              () => onResetTracker('points2'),
              () => onResetTracker('points3'),
              () => onResetTracker('points4'),
            ].slice(0, playerCount)}
            subtitles={[
              `Updated ${timeAgo(lastChanged)}`,
              `Updated ${timeAgo(lastChanged2)}`,
              `Updated ${timeAgo(lastChanged3)}`,
              `Updated ${timeAgo(lastChanged4)}`,
            ].slice(0, playerCount)}
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
