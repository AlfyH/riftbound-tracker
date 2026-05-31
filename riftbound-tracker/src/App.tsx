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
  action: '+1' | '-1' | 'reset' | 'end-turn';
  label: string;
  gameKey: keyof GameState | 'all';
  from: number;
  value: number;
  prevSnapshot?: GameState;
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
    setHistory(prev => [{ action, label: TRACKER_LABELS[key], gameKey: key, from: prevValue, value: newValue, time: new Date() }, ...prev].slice(0, 100));
  };

  const undo = () => {
    setHistory(prev => {
      const [last, ...rest] = prev;
      if (!last) return prev;
      if (last.gameKey === 'all' && last.prevSnapshot) {
        setState(last.prevSnapshot);
      } else if (last.gameKey !== 'all') {
        setState(s => ({ ...DEFAULT_STATE, ...s, [last.gameKey]: last.from }));
      }
      return rest;
    });
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

  const endTurn = () => {
    const now = new Date();
    const entries: ActionEntry[] = [];
    if (mergedState.energy !== 0) {
      entries.push({ action: 'end-turn' as const, label: 'Energy', gameKey: 'energy' as const, from: mergedState.energy, value: 0, time: now });
    }
    if (mergedState.power !== 0) {
      entries.push({ action: 'end-turn' as const, label: 'Power', gameKey: 'power' as const, from: mergedState.power, value: 0, time: now });
    }
    if (entries.length === 0) {
      entries.push({ action: 'end-turn' as const, label: 'End Turn', gameKey: 'energy' as const, from: 0, value: 0, time: now });
    }
    setHistory(prev => [...entries, ...prev].slice(0, 100));
    if (mergedState.energy !== 0 || mergedState.power !== 0) {
      setState(s => ({ ...s, energy: 0, power: 0 }));
    }
  };

  const resetAll = () => {
    setHistory(prev => [{ action: 'reset' as const, label: 'All Trackers', gameKey: 'all' as const, from: 0, value: 0, prevSnapshot: mergedState, time: new Date() }, ...prev].slice(0, 100));
    setState(DEFAULT_STATE);
  };

  return (
    <div className="app">
      <ResourceLayout
        state={mergedState}
        onIncrement={increment}
        onDecrement={decrement}
        onResetTracker={resetTracker}
        onOpenHelp={() => setHelpOpen(true)}
        onBoardReset={resetAll}
        onEndTurn={endTurn}
        onUndo={undo}
        canUndo={history.length > 0}
        playerCount={playerCount}
      />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} playerCount={playerCount} onSetPlayerCount={setPlayerCount} history={history} onClearHistory={() => setHistory([])} />}
    </div>
  );
}

export default App;
