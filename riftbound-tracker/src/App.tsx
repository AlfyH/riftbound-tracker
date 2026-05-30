import { useState } from 'react';
import ResourceLayout from './components/ResourceLayout';
import HelpOverlay from './components/HelpOverlay';
import usePersistentState from './hooks/usePersistentState';
import './styles/App.css';

export interface GameState {
  points: number;
  points2: number;
  points3: number;
  points4: number;
  xp: number;
  energy: number;
  power: number;
  runes: number;
}

export interface ActionEntry {
  action: '+1' | '-1' | 'reset';
  label: string;
  from: number;
  value: number;
  time: Date;
}

const TRACKER_LABELS: Record<keyof GameState, string> = {
  points: 'Points',
  points2: 'P2 Points',
  points3: 'P3 Points',
  points4: 'P4 Points',
  xp: 'XP',
  energy: 'Energy',
  power: 'Power',
  runes: 'Runes',
};

const DEFAULT_STATE: GameState = {
  points: 0,
  points2: 0,
  points3: 0,
  points4: 0,
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
  const [playerCount, setPlayerCount] = useState(1);
  const [history, setHistory] = useState<ActionEntry[]>([]);

  const pushHistory = (action: ActionEntry['action'], key: keyof GameState, prevValue: number, newValue: number) => {
    setHistory(prev => [{ action, label: TRACKER_LABELS[key], from: prevValue, value: newValue, time: new Date() }, ...prev].slice(0, 100));
  };

  const increment = (key: keyof GameState) => {
    const newVal = mergedState[key] + 1;
    setState({ ...mergedState, [key]: newVal });
    pushHistory('+1', key, mergedState[key], newVal);
  };

  const decrement = (key: keyof GameState) => {
    const newVal = Math.max(0, mergedState[key] - 1);
    if (mergedState[key] !== newVal) {
      setState({ ...mergedState, [key]: newVal });
      pushHistory('-1', key, mergedState[key], newVal);
    }
  };

  const resetTracker = (key: keyof GameState) => {
    if (mergedState[key] !== 0) {
      setState({ ...mergedState, [key]: 0 });
      pushHistory('reset', key, mergedState[key], 0);
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
        playerCount={playerCount}
      />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} playerCount={playerCount} onSetPlayerCount={setPlayerCount} history={history} onClearHistory={() => setHistory([])} />}
    </div>
  );
}

export default App;
