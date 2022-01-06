import { useEffect, useState } from "react";

export default function usePersistentState<T>(
  storageKey: string,
  defaultValue?: T
) {
  const [state, setState] = useState(defaultValue);

  const storedStateStr = localStorage.getItem(storageKey);
  const storedState =
    storedStateStr === null ? null : JSON.parse(storedStateStr);

  useEffect(() => {
    if (storedState && storedState !== state) {
      setState(storedState);
    }
  }, [storedState, state]);

  const setAndPersistState: typeof setState = (newState) => {
    setState(newState);
    localStorage.setItem(storageKey, JSON.stringify(newState));
  };

  return [storedState ?? state, setAndPersistState] as const;
}
