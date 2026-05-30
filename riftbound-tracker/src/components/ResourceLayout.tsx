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
  onBoardReset: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  playerCount: number;
}

function timeAgo(date: Date, now: number): string {
  const secs = Math.floor((now - date.getTime()) / 1000);
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
  onBoardReset,
  onUndo,
  canUndo,
  playerCount,
}) => {
  const [lastChanged, setLastChanged] = useState(() => new Date());
  const [lastChanged2, setLastChanged2] = useState(() => new Date());
  const [lastChanged3, setLastChanged3] = useState(() => new Date());
  const [lastChanged4, setLastChanged4] = useState(() => new Date());
  const [lastChangedEnergy, setLastChangedEnergy] = useState(() => new Date());
  const [lastChangedPower, setLastChangedPower] = useState(() => new Date());
  const [lastChangedXp, setLastChangedXp] = useState(() => new Date());
  const [tickedNow, setTickedNow] = useState(() => Date.now());
  const [pointsCollapsed, setPointsCollapsed] = useState(false);
  const [xpCollapsed, setXpCollapsed] = useState(false);
  const [floatingCollapsed, setFloatingCollapsed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTickedNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="resource-layout">
      <div className="gesture-hints" aria-hidden="true">
        <span>↑ swipe ↓</span>
        <span className="gesture-hints__sep">·</span>
        <span>×2 tap reset</span>
      </div>
      <div className={`resource-layout__cards${playerCount > 1 ? ' resource-layout__cards--two-player' : ''}${playerCount > 2 ? ' resource-layout__cards--multi-player' : ''}`}>
        {playerCount > 1 ? (
          <PointsSplitCard
            key={playerCount}
            values={[state.points, state.points2, state.points3, state.points4].slice(0, playerCount)}
            onIncrements={[
              () => { setLastChanged(new Date()); onIncrement('points'); },
              () => { setLastChanged2(new Date()); onIncrement('points2'); },
              () => { setLastChanged3(new Date()); onIncrement('points3'); },
              () => { setLastChanged4(new Date()); onIncrement('points4'); },
            ].slice(0, playerCount)}
            onDecrements={[
              () => { setLastChanged(new Date()); onDecrement('points'); },
              () => { setLastChanged2(new Date()); onDecrement('points2'); },
              () => { setLastChanged3(new Date()); onDecrement('points3'); },
              () => { setLastChanged4(new Date()); onDecrement('points4'); },
            ].slice(0, playerCount)}
            onResets={[
              () => { setLastChanged(new Date()); onResetTracker('points'); },
              () => { setLastChanged2(new Date()); onResetTracker('points2'); },
              () => { setLastChanged3(new Date()); onResetTracker('points3'); },
              () => { setLastChanged4(new Date()); onResetTracker('points4'); },
            ].slice(0, playerCount)}
            subtitles={[
              `Updated ${timeAgo(lastChanged, tickedNow)}`,
              `Updated ${timeAgo(lastChanged2, tickedNow)}`,
              `Updated ${timeAgo(lastChanged3, tickedNow)}`,
              `Updated ${timeAgo(lastChanged4, tickedNow)}`,
            ].slice(0, playerCount)}
            collapsed={pointsCollapsed}
            onToggleCollapse={() => setPointsCollapsed((v) => !v)}
          />
        ) : (
          <TrackerCard
            label="Points"
            value={state.points}
            onIncrement={() => { setLastChanged(new Date()); onIncrement('points'); }}
            onDecrement={() => { setLastChanged(new Date()); onDecrement('points'); }}
            onReset={() => { setLastChanged(new Date()); onResetTracker('points'); }}
            size="large"
            subtitle={`Updated ${timeAgo(lastChanged, tickedNow)}`}
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
                onIncrement={() => { setLastChangedEnergy(new Date()); onIncrement('energy'); }}
                onDecrement={() => { setLastChangedEnergy(new Date()); onDecrement('energy'); }}
                onReset={() => { setLastChangedEnergy(new Date()); onResetTracker('energy'); }}
                accent="orange"
                subtitle={`Updated ${timeAgo(lastChangedEnergy, tickedNow)}`}
              />
              <TrackerCard
                label="Power"
                value={state.power}
                onIncrement={() => { setLastChangedPower(new Date()); onIncrement('power'); }}
                onDecrement={() => { setLastChangedPower(new Date()); onDecrement('power'); }}
                onReset={() => { setLastChangedPower(new Date()); onResetTracker('power'); }}
                accent="red"
                subtitle={`Updated ${timeAgo(lastChangedPower, tickedNow)}`}
              />
            </div>
          )}
        </div>
        <TrackerCard
          label="XP"
          value={state.xp}
          onIncrement={() => { setLastChangedXp(new Date()); onIncrement('xp'); }}
          onDecrement={() => { setLastChangedXp(new Date()); onDecrement('xp'); }}
          onReset={() => { setLastChangedXp(new Date()); onResetTracker('xp'); }}
          accent="yellow"
          subtitle={`Updated ${timeAgo(lastChangedXp, tickedNow)}`}
          collapsed={xpCollapsed}
          onToggleCollapse={() => setXpCollapsed((v) => !v)}
          onHelp={onOpenHelp}
          onBoardReset={onBoardReset}
          onUndo={onUndo}
          canUndo={canUndo}
        />
      </div>
    </div>
  );
};

export default ResourceLayout;
