// This file serves as a central hub for re-exporting pre-typed Redux hooks.
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "./store";
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useCounterDown = ({
  initialCount,
  status = true,
}: {
  initialCount: number;
  status?: boolean;
  onEnd: () => void;
}) => {
  const [counter, setCounter] = useState(initialCount);
  const counterRef = useRef<NodeJS.Timer | undefined>(undefined);
  useEffect(() => {
    if (!status) {
      if (counterRef.current) {
        clearInterval(counterRef.current);
        counterRef.current = undefined;
      }
      return;
    }
    counterRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) return initialCount;

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(counterRef.current);
  }, [initialCount, status]);

  const stopCounter = () => (counterRef.current = undefined);
  const restCounter = () => setCounter(initialCount);
  return {
    counter,
    stopCounter,
    restCounter,
  };
};
