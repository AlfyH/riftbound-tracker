import { useState, useCallback } from 'react';

type Setter<T> = (value: T | ((prev: T) => T)) => void;

interface UseUndoReturn<T> {
  setState: (newState: T) => void;
  undo: () => void;
  canUndo: boolean;
}

/**
 * Wraps an external state setter with an undo history stack.
 * The caller owns the "current" state; this hook manages the history.
 */
function useUndo<T>(currentState: T, setCurrentState: Setter<T>): UseUndoReturn<T> {
  const [history, setHistory] = useState<T[]>([]);

  const setState = useCallback(
    (newState: T) => {
      // Push the snapshot we're leaving before changing
      setHistory((prev) => [...prev, currentState]);
      setCurrentState(newState);
    },
    [currentState, setCurrentState],
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev.at(-1) as T;
      setCurrentState(previous);
      return prev.slice(0, -1);
    });
  }, [setCurrentState]);

  return {
    setState,
    undo,
    canUndo: history.length > 0,
  };
}

export default useUndo;
