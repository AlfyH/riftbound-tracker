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
  const [xpCollapsed, setXpCollapsed] = useState(false);
  const [energyCollapsed, setEnergyCollapsed] = useState(false);
  const [powerCollapsed, setPowerCollapsed] = useState(false);

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
        />

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
        <TrackerCard
          label="Floating Energy"
          value={state.energy}
          onIncrement={() => onIncrement('energy')}
          onDecrement={() => onDecrement('energy')}
          onReset={() => onResetTracker('energy')}
          accent="orange"
          collapsed={energyCollapsed}
          onToggleCollapse={() => setEnergyCollapsed((v) => !v)}
        />
        <TrackerCard
          label="Floating Power"
          value={state.power}
          onIncrement={() => onIncrement('power')}
          onDecrement={() => onDecrement('power')}
          onReset={() => onResetTracker('power')}
          accent="red"
          collapsed={powerCollapsed}
          onToggleCollapse={() => setPowerCollapsed((v) => !v)}
        />
        <div className="resource-layout__row">
          <DisplayCard
            label="Available Energy"
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
