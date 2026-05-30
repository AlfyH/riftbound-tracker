import { useState } from 'react';
import ResourceLayout from './components/ResourceLayout';
import HelpOverlay from './components/HelpOverlay';
import usePersistentState from './hooks/usePersistentState';
import './styles/App.css';

export interface GameState {
  points: number;
  xp: number;
  energy: number;
  power: number;
  runes: number;
}

const DEFAULT_STATE: GameState = {
  points: 0,
  xp: 0,
  energy: 0,
  power: 0,
  runes: 0,
};

function App() {
  const [state, setState] = usePersistentState<GameState>('riftbound-state', DEFAULT_STATE);
  const [helpOpen, setHelpOpen] = useState(false);

  const increment = (key: keyof GameState) => {
    setState({ ...state, [key]: state[key] + 1 });
  };

  const decrement = (key: keyof GameState) => {
    setState({ ...state, [key]: Math.max(0, state[key] - 1) });
  };

  const resetTracker = (key: keyof GameState) => {
    if (state[key] !== 0) {
      setState({ ...state, [key]: 0 });
    }
  };

  return (
    <div className="app">
      <ResourceLayout
        state={state}
        onIncrement={increment}
        onDecrement={decrement}
        onResetTracker={resetTracker}
        onOpenHelp={() => setHelpOpen(true)}
      />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

export default App;
