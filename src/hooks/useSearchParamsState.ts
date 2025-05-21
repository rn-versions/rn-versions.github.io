import { useCallback, useState } from "react";

export default function useSearchParamsState<T extends string | null>(
  storageKey: string,
  defaultValue: T
) {
  const [state, setState] = useState<T>(() => {
    const url = new URL(window.location.href);
    const storedState = url.searchParams.get(storageKey) as T | null;
    return storedState ?? defaultValue;
  });

  const setAndPersistState = useCallback(
    (newState: T) => {
      const url = new URL(window.location.href);
      if (newState === null) {
        url.searchParams.delete(storageKey);
      } else {
        url.searchParams.set(storageKey, newState);
      }
      window.history.replaceState({}, "", url.href);
      setState(newState);
    },
    [storageKey]
  );

  return [state, setAndPersistState] as const;
}
