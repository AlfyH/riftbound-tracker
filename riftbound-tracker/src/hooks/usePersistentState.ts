import { useState, useCallback } from 'react';

type Setter<T> = (value: T | ((prev: T) => T)) => void;

function usePersistentState<T>(key: string, initialValue: T): [T, Setter<T>] {
  const [internalState, setInternalState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // Ignore parse errors – fall through to initialValue
    }
    return initialValue;
  });

  const setState: Setter<T> = useCallback(
    (value) => {
      setInternalState((prev) => {
        const next =
          typeof value === 'function'
            ? (value as (prev: T) => T)(prev)
            : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage unavailable – state still updates in memory
        }
        return next;
      });
    },
    [key],
  );

  return [internalState, setState];
}

export default usePersistentState;
