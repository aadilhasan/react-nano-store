export type Keys<Store extends Record<string, any>> = keyof Store;

export type StateSetter<
  K extends Keys<Store>,
  Store extends Record<string, any>
> = (newState: Partial<{ [key in K]: Store[K] }>) => void;

export type HookReturnType<
  K extends Keys<Store>,
  Store extends Record<string, any>
> = [Record<K, any>, StateSetter<K, Store>];

export type ContextReturn<Store extends Record<string, any>> = <
  K extends Keys<Store>
>(
  keys: K[]
) => HookReturnType<K, Store>;

export type SubscribeCallback<Store extends Record<string, any>> = (
  changedValueKey: Keys<Store>,
  changedValue: Store[Keys<Store>]
) => void;
