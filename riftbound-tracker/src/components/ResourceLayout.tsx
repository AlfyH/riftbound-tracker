import React from 'react';
import TrackerCard from './TrackerCard';
import type { GameState } from '../App';

interface ResourceLayoutProps {
  state: GameState;
  onIncrement: (key: keyof GameState) => void;
  onDecrement: (key: keyof GameState) => void;
  onResetTracker: (key: keyof GameState) => void;
}

const ResourceLayout: React.FC<ResourceLayoutProps> = ({
  state,
  onIncrement,
  onDecrement,
  onResetTracker,
}) => {
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
        />
        <TrackerCard
          label="XP"
          value={state.xp}
          onIncrement={() => onIncrement('xp')}
          onDecrement={() => onDecrement('xp')}
          onReset={() => onResetTracker('xp')}
          accent="yellow"
        />
        <TrackerCard
          label="Floating Energy"
          value={state.energy}
          onIncrement={() => onIncrement('energy')}
          onDecrement={() => onDecrement('energy')}
          onReset={() => onResetTracker('energy')}
          accent="orange"
        />
        <TrackerCard
          label="Floating Power"
          value={state.power}
          onIncrement={() => onIncrement('power')}
          onDecrement={() => onDecrement('power')}
          onReset={() => onResetTracker('power')}
          accent="red"
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
  );
};

export default ResourceLayout;
