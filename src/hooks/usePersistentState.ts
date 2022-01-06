import { useEffect, useState } from "react";

export default function usePersistentState<T>(
  storageKey: string,
  defaultValue?: T
) {
  const storedStateStr = localStorage.getItem(storageKey);
  const storedState =
    storedStateStr === null ? null : JSON.parse(storedStateStr);

  const [state, setState] = useState(storedState ?? defaultValue);
  const [lastStorageKey, setLastStorageKey] = useState<string>();

  useEffect(() => {
    if (lastStorageKey !== storageKey) {
      setState(storedState ?? defaultValue);
      setLastStorageKey(lastStorageKey);
    }
  }, [defaultValue, lastStorageKey, storageKey, storedState]);

  const setAndPersistState = (newState: T) => {
    localStorage.setItem(storageKey, JSON.stringify(newState));
    setState(newState);
  };

  if (storageKey === lastStorageKey) {
    return [state, setAndPersistState] as const;
  } else {
    return [storedState ?? defaultValue, setAndPersistState] as const;
  }
}
