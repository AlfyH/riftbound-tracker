import { useState } from 'react';
import ResourceLayout from './components/ResourceLayout';
import HelpOverlay from './components/HelpOverlay';
import usePersistentState from './hooks/usePersistentState';
import './styles/App.css';

export interface GameState {
  points: number;
  points2: number;
  xp: number;
  energy: number;
  power: number;
  runes: number;
}

const DEFAULT_STATE: GameState = {
  points: 0,
  points2: 0,
  xp: 0,
  energy: 0,
  power: 0,
  runes: 0,
};

function App() {
  const [state, setState] = usePersistentState<GameState>('riftbound-state', DEFAULT_STATE);
  // Merge with defaults so new fields (e.g. points2) aren't undefined on old saves
  const mergedState: GameState = { ...DEFAULT_STATE, ...state };
  const [helpOpen, setHelpOpen] = useState(false);
  const [twoPlayer, setTwoPlayer] = useState(false);

  const increment = (key: keyof GameState) => {
    setState({ ...mergedState, [key]: mergedState[key] + 1 });
  };

  const decrement = (key: keyof GameState) => {
    setState({ ...mergedState, [key]: Math.max(0, mergedState[key] - 1) });
  };

  const resetTracker = (key: keyof GameState) => {
    if (mergedState[key] !== 0) {
      setState({ ...mergedState, [key]: 0 });
    }
  };

  return (
    <div className="app">
      <ResourceLayout
        state={mergedState}
        onIncrement={increment}
        onDecrement={decrement}
        onResetTracker={resetTracker}
        onOpenHelp={() => setHelpOpen(true)}
        twoPlayer={twoPlayer}
      />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} twoPlayer={twoPlayer} onToggleTwoPlayer={() => setTwoPlayer((v) => !v)} />}
    </div>
  );
}

export default App;
