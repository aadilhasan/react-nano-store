import { useCallback, useEffect, useState, useRef } from "react";
import {
  ContextReturn,
  Keys,
  SubscribeCallback,
  HookReturnType,
  StateSetter,
} from "./types";

export function createStore<Store extends Record<string, any>>(
  initialStore: Store
): ContextReturn<Store> {
  type StoreKeys = Keys<Store>;
  let store = { ...initialStore };
  const subscribers = new Map<StoreKeys, SubscribeCallback<Store>[]>();

  const subscribe = (
    values: StoreKeys[],
    callback: SubscribeCallback<Store>
  ) => {
    values.forEach((value) => {
      const callbacks = subscribers.get(value) || [];
      callbacks.push(callback);
      subscribers.set(value, callbacks);
    });
    return () => {
      values.forEach((value) => {
        const callbacks = subscribers.get(value) || [];
        subscribers.set(
          value,
          callbacks.filter((cb) => cb !== callback)
        );
      });
    };
  };

  const emit = (key: StoreKeys, value: any) => {
    const callbacks = subscribers.get(key) || [];
    callbacks.forEach((cb) => cb(key, value));
  };

  const set = (key: StoreKeys, value: any) => {
    store = { ...store, [key]: value };
    emit(key, value);
  };

  function useStore<K extends StoreKeys>(keys: K[]): HookReturnType<K, Store> {
    const keysRef = useRef(keys);
    const [state, setState] = useState<Record<K, any>>(() => {
      let _state = {} as Record<K, any>;
      keys.forEach((key) => {
        _state[key] = store[key];
      });
      return _state;
    });

    useEffect(() => {
      const onValueChange = (key: StoreKeys, value: Store[StoreKeys]) => {
        setState((prev) => ({ ...prev, [key]: value }));
      };
      return subscribe(keysRef.current, onValueChange);
    }, [keysRef]);

    const updateState: StateSetter<K, Store> = useCallback(
      (newState: Partial<Record<K, Store[K]>>) => {
        keysRef.current.forEach((value) => {
          if (value in newState) {
            set(value, newState[value]);
          }
        });
      },
      []
    );
    return [state, updateState];
  }

  return useStore;
}

export default createStore;
