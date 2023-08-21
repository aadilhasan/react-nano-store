import { useCallback, useEffect, useState, useRef } from "react";
import {
  ContextReturn,
  Keys,
  SubscribeCallback,
  HookReturnType,
  StateSetter,
  HookStateUpdater,
  StateType,
} from "./types";

export function createStore<Store extends Record<string, any>>(
  initialStore: Store
): ContextReturn<Store> {
  type StoreKeys = Keys<Store>;
  let store = { ...initialStore };
  const subscribers = new Set<SubscribeCallback<Store>>();

  const subscribe = (callback: SubscribeCallback<Store>) => {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  };

  const emit = (key: StoreKeys, value: any) => {
    subscribers.forEach((subscriber) => {
      subscriber(key, value);
    });
  };

  const set = (key: StoreKeys, value: any) => {
    store = { ...store, [key]: value };
    emit(key, value);
  };

  function useStore<KeysArray extends StoreKeys>(
    keys: KeysArray[] = []
  ): HookReturnType<KeysArray, Store> {
    const keysRef = useRef(keys || []);
    const [state, setState] = useState<StateType<Store, KeysArray>>(() => {
      let _state = {} as StateType<Store, KeysArray>;
      if (keys) {
        keys.forEach((key) => {
          // @ts-ignore
          _state[key] = store[key];
        });
      }
      return _state;
    });

    useEffect(() => {
      const onValueChange = (key: StoreKeys, value: Store[StoreKeys]) => {
        if (keysRef.current.includes(key as KeysArray)) {
          setState((prev) => ({ ...prev, [key]: value }));
        }
      };
      return subscribe(onValueChange);
    }, [keysRef]);

    const updateState: HookStateUpdater<Store> = useCallback(
      (newStateOrCallback) => {
        let newState: Partial<Store> = {};

        if (typeof newStateOrCallback === "function") {
          newState = newStateOrCallback(store);
        } else {
          newState = newStateOrCallback;
        }

        for (let key in newState) {
          if (key in store) {
            set(key, newState[key]);
          }
        }
      },
      []
    );
    return [state, updateState];
  }

  return useStore;
}

export default createStore;
