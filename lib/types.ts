export type Keys<Store extends Record<string, any>> = keyof Store;
export interface HookStateUpdater<Store extends Record<string, any>> {
  (newState: Partial<Store>): void;
}

export type StateType<
  Store extends Record<string, any>,
  KeysArray extends Keys<Store>
> = KeysArray extends undefined ? undefined : { [K in KeysArray]: Store[K] };

export interface HookStateUpdater<Store extends Record<string, any>> {
  (callback: (store: Store) => Partial<Store>): void;
}

export type StateSetter<
  K extends Keys<Store>,
  Store extends Record<string, any>
> = (newState: Partial<{ [key in K]: Store[K] }>) => void;

export type HookReturnType<
  KeysArray extends Keys<Store>,
  Store extends Record<string, any>
> = [StateType<Store, KeysArray>, HookStateUpdater<Store>];

export type ContextReturn<Store extends Record<string, any>> = <
  K extends Keys<Store>
>(
  keys?: K[]
) => HookReturnType<K, Store>;

export type SubscribeCallback<Store extends Record<string, any>> = (
  changedValueKey: Keys<Store>,
  changedValue: Store[Keys<Store>]
) => void;
