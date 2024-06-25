import type { Eventual } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { ArrayItem } from '@voiceflow/ui';
import { useCachedValue, useCreateConst, useForceUpdate, usePersistFunction } from '@voiceflow/ui';
import type { DebouncedFunc } from 'lodash';
import _debounce from 'lodash/debounce';
import moize from 'moize';
import * as Normal from 'normal-store';
import React from 'react';

import { IS_TEST } from '@/config';
import { TransactionContext } from '@/contexts/TransactionContext';

import { useLazy } from './lazy';

const UNIQUE_TYPES = new Set(['object', 'function']);

const DEBOUNCE_TIMEOUT = 300;

export type OnManagerChange<Item> = (items: Item[], save?: boolean) => Eventual<void>;

interface MapManagedRenderOptions<Item> {
  key: string;
  index: number;
  isLast: boolean;
  isFirst: boolean;
  onUpdate: (value: Partial<Item>) => void;
  onRemove: VoidFunction;
}

interface MapManagedBaseOptions<Item> {
  clone?: (initVal: Item, targetVal: Item) => Item;
  onAdd?: (value: Item, index: number) => Eventual<void | void[]>;
  getKey?: (value: Item) => string;
  onAdded?: (value: Item, index: number) => Eventual<void | void[]>;
  validate?: (value: Item, options: { index: number; isUpdate: boolean; originalValue: Item | null }) => boolean;
  minItems?: number;
  maxItems?: number;
  onRemove?: (value: Item, index: number) => Eventual<void | void[]>;
  onRemoved?: (value: Item, index: number) => Eventual<void | void[]>;
  debounced?: boolean;
  onReorder?: (from: number, to: number) => Eventual<void | void[]>;
  onReordered?: (from: number, to: number) => Eventual<void | void[]>;
  maxVisibleItems?: number;
}

export interface MapManagedSimpleOptions<Item> extends MapManagedBaseOptions<Item> {
  factory?: never;
}

export interface MapManagedFactoryOptions<Item> extends MapManagedBaseOptions<Item> {
  factory: () => Item;
}

export type MapManaged<Item> = (
  render: (item: Item, options: MapManagedRenderOptions<Item>) => React.ReactNode
) => React.ReactNode[];

interface MapManagedBaseAPI<Item> {
  map: MapManaged<Item>;
  size: number;
  keys: string[];
  items: Item[];
  isEmpty: boolean;
  getIndex: (key: string) => number;
  onUpdate: (key: string, value: Partial<Item>) => Promise<void>;
  onRemove: (key: string) => Promise<void>;
  onReorder: (from: number, to: number) => Promise<void>;
  isOnlyItem: boolean;
  isMinReached: boolean;
  isMaxReached: boolean;
  latestCreatedKey: string | undefined;
  getCachedItems: () => Item[];
}

export interface MapManagedSimpleAPI<Item> extends MapManagedBaseAPI<Item> {
  onAdd: (newItem: Item) => Promise<void>;
  onDuplicate: (to: number, duplicatedItem: Item, newItem: Item) => Promise<void>;
  onAddToStart: (newItem: Item) => Promise<void>;
}

export interface MapManagedFactoryAPI<Item> extends MapManagedBaseAPI<Item> {
  onAdd: () => Promise<void>;
  onDuplicate: (to: number, item: Item) => Promise<void>;
  onAddToStart: () => Promise<void>;
}

interface MapManager {
  <Item>(
    items: Item[],
    onChange: OnManagerChange<Item>,
    options?: MapManagedSimpleOptions<Item>
  ): MapManagedSimpleAPI<Item>;
  <Item>(
    items: Item[],
    onChange: OnManagerChange<Item>,
    options: MapManagedFactoryOptions<Item>
  ): MapManagedFactoryAPI<Item>;
}

export const useMapManager: MapManager = (
  items,
  onChange,
  {
    clone,
    onAdd: handleAdd,
    getKey,
    factory,
    onAdded: handleAdded,
    onRemoved: handleRemoved,
    validate = () => true,
    minItems,
    maxItems,
    onRemove: handleRemove,
    debounced = true,
    onReorder: handleReorder,
    onReordered: handleReordered,
    maxVisibleItems,
  } = {}
) => {
  type Item = ArrayItem<typeof items>;

  const transaction = React.useContext(TransactionContext);

  const [forceUpdate] = useForceUpdate();

  const defaultKeyLookup = useCreateConst<Map<Item | [Item, number], string>>(() => new Map());
  const defaultNormalized = useCreateConst<Normal.Normalized<Item>>(Normal.createEmpty);
  const generateLookupKey = useCreateConst(() =>
    moize((value: Item, index: number): Item | [Item, number] =>
      value !== null && UNIQUE_TYPES.has(typeof value) ? value : [value, index]
    )
  );

  const keyLookup = React.useRef<Map<Item | [Item, number], string>>(defaultKeyLookup);
  const normalized = React.useRef<Normal.Normalized<Item>>(defaultNormalized);
  const latestCreatedKey = React.useRef<string>('');

  const persistedClone = usePersistFunction(
    (initialItem: Item, targetItem: Item): Item => clone?.(initialItem, targetItem) ?? { ...initialItem }
  );
  const persistedGetKey = usePersistFunction((item: Item) => getKey?.(item) || Utils.id.cuid.slug());
  const persistedFactory = usePersistFunction((item?: Item): Item => factory?.() ?? item!);
  const persistedGetItem = usePersistFunction((key: string) => normalized.current.byKey[key]);
  const persistedGetIndex = usePersistFunction((key: string) => normalized.current.allKeys.indexOf(key));
  const persistedValidate = usePersistFunction(validate);
  const persistedHandleAdd = usePersistFunction(handleAdd);
  const persistedHandleAdded = usePersistFunction(handleAdded);
  const persistedHandleRemove = usePersistFunction(handleRemove);
  const persistedHandleReorder = usePersistFunction(handleReorder);
  const persistedHandleRemoved = usePersistFunction(handleRemoved);
  const persistedHandleReordered = usePersistFunction(handleReordered);

  const persistedCreateKeyValue = usePersistFunction((newItem?: Item) => {
    const value = persistedFactory(newItem);
    const key = persistedGetKey(value);

    return { key, value };
  });

  const persistedDuplicateKeyValue = usePersistFunction((item: Item, newItem?: Item) => {
    const value = persistedClone(persistedFactory(newItem), item);
    const key = persistedGetKey(value);

    return { key, value };
  });

  const setDependencies = useLazy(
    () => {
      keyLookup.current = new Map(
        items.map((item, index) => [generateLookupKey(item, index), IS_TEST ? String(index) : persistedGetKey(item)])
      );
      normalized.current = Normal.normalize<Item>(
        items,
        (item, index) => keyLookup.current.get(generateLookupKey(item, index))!
      );
    },
    [items],
    ([nextItems], [prevItems]) => Utils.array.hasIdenticalMembers<Item>(nextItems, prevItems)
  );
  const persistedOnChanged = usePersistFunction<OnManagerChange<Item>>((denormalized: Item[], save?: boolean) => {
    setDependencies([denormalized]);
    onChange(denormalized, save);
  });

  const isMinReached = useCachedValue(minItems == null ? false : normalized.current.allKeys.length <= minItems);
  const isMaxReached = useCachedValue(maxItems == null ? false : normalized.current.allKeys.length >= maxItems);

  const debouncedOnChange = React.useMemo<OnManagerChange<Item> | DebouncedFunc<OnManagerChange<Item>>>(
    () =>
      debounced
        ? _debounce((denormalized: Item[]) => persistedOnChanged(denormalized), DEBOUNCE_TIMEOUT)
        : persistedOnChanged,
    [debounced]
  );

  const onSave = React.useCallback(
    async (normalizedValue: Normal.Normalized<Item>, { update, save }: { update?: boolean; save?: boolean } = {}) => {
      const denormalized = Normal.denormalize(normalizedValue);

      if (!update && 'cancel' in debouncedOnChange) {
        debouncedOnChange.cancel();
      }

      normalized.current = normalizedValue;
      forceUpdate();

      if (update) {
        await debouncedOnChange(denormalized);
      } else {
        persistedOnChanged(denormalized, save);
      }
    },
    [debouncedOnChange]
  );

  const commitInsert = React.useCallback(
    async (key: string, value: Item, index: number, updated: Normal.Normalized<Item>) => {
      keyLookup.current.set(generateLookupKey(value, index), key);
      latestCreatedKey.current = key;

      await transaction(() => Promise.all([onSave(updated), persistedHandleAdd(value, index)]));

      persistedHandleAdded(value, index);
    },
    [onSave]
  );

  const onAdd = React.useCallback(
    async (newItem?: Item) => {
      if (isMaxReached.current) return;

      const index = normalized.current.allKeys.length;
      const { key, value } = persistedCreateKeyValue(newItem);

      if (persistedValidate(value, { index, isUpdate: false, originalValue: null }) === false) return;

      const updated = Normal.appendOne(normalized.current, key, value);

      await commitInsert(key, value, index, updated);
    },
    [commitInsert]
  );

  const onAddToStart = React.useCallback(
    async (newItem?: Item) => {
      if (isMaxReached.current) return;

      const index = 0;
      const { key, value } = persistedCreateKeyValue(newItem);

      if (persistedValidate(value, { index, isUpdate: false, originalValue: null }) === false) return;

      const updated = Normal.prependOne(normalized.current, key, value);

      await commitInsert(key, value, index, updated);
    },
    [commitInsert]
  );

  const onDuplicate = React.useCallback(
    async (to: number, item: Item, newItem?: Item) => {
      if (isMaxReached.current) return;

      const { key, value: dupVal } = persistedDuplicateKeyValue(item, newItem);

      const withDupVal = Normal.prependOne(normalized.current, key, dupVal);
      const dupIndex = to + 1;

      const updated = {
        ...withDupVal,
        allKeys: Utils.array.reorder(withDupVal.allKeys, 0, dupIndex),
      };

      await commitInsert(key, dupVal, dupIndex, updated);
    },
    [commitInsert]
  );

  const onReorder = React.useCallback(
    async (from: number, to: number) => {
      const updated = {
        ...normalized.current,
        allKeys: Utils.array.reorder(normalized.current.allKeys, from, to),
      };

      await transaction(() => Promise.all([onSave(updated, { update: true }), persistedHandleReorder(from, to)]));

      persistedHandleReordered(from, to);
    },
    [onSave]
  );

  const onUpdate = React.useCallback(
    async (key: string, value: Partial<Item>) => {
      const index = persistedGetIndex(key);
      const currValue = persistedGetItem(key);

      const valueIsObject = Utils.object.isObject(value);
      const currValueIsObject = Utils.object.isObject(currValue);

      if (currValueIsObject && valueIsObject && Utils.object.shallowPartialEquals(currValue, value)) return;

      const nextValue =
        currValue && !Array.isArray(currValue) && currValueIsObject ? { ...currValue, ...value } : (value as Item);

      if (validate?.(nextValue, { index, isUpdate: true, originalValue: currValue }) === false) return;

      const updated = Normal.updateOne(normalized.current, key, nextValue);

      keyLookup.current.delete(generateLookupKey(currValue, index));
      keyLookup.current.set(generateLookupKey(updated.byKey[key], index), key);

      await transaction(() => onSave(updated, { update: true }));
    },
    [onSave]
  );

  const memoizedUpdate = React.useMemo(
    () => moize((key: string) => (value: Partial<Item>) => onUpdate(key, value)),
    [onUpdate]
  );

  const onRemove = React.useCallback(
    async (key: string) => {
      if (isMinReached.current) return;

      const currValue = persistedGetItem(key);
      const currIndex = persistedGetIndex(key);

      const updated = Normal.removeOne(normalized.current, key);

      keyLookup.current.delete(generateLookupKey(currValue, currIndex));

      await transaction(async () => Promise.all([onSave(updated), persistedHandleRemove(currValue, currIndex)]));

      persistedHandleRemoved(currValue, currIndex);
    },
    [onSave]
  );

  const getCachedItems = React.useCallback(() => Normal.denormalize(normalized.current), []);

  const memoizedRemove = React.useMemo(() => moize((key: string) => () => onRemove(key)), [onRemove]);

  const map = React.useCallback<MapManaged<Item>>(
    (render) => {
      const keys =
        typeof maxVisibleItems === 'number'
          ? normalized.current.allKeys.slice(0, maxVisibleItems)
          : normalized.current.allKeys;

      return keys.map((key, index) =>
        render(persistedGetItem(key), {
          key,
          index,
          isLast: index === keys.length - 1,
          isFirst: index === 0,
          onUpdate: memoizedUpdate(key),
          onRemove: memoizedRemove(key),
        })
      );
    },
    [memoizedUpdate, memoizedRemove, maxVisibleItems]
  );

  React.useEffect(() => memoizedUpdate.clear, [memoizedUpdate]);
  React.useEffect(() => memoizedRemove.clear, [memoizedRemove]);
  React.useEffect(() => generateLookupKey.clear, [generateLookupKey]);

  return {
    map,
    size: normalized.current.allKeys.length,
    keys: normalized.current.allKeys,
    items,
    onAdd,
    isEmpty: !normalized.current.allKeys.length,
    onUpdate,
    getIndex: persistedGetIndex,
    onRemove,
    onReorder,
    isOnlyItem: normalized.current.allKeys.length === 1,
    onDuplicate,
    onAddToStart,
    isMinReached: isMinReached.current,
    isMaxReached: isMaxReached.current,
    getCachedItems,
    latestCreatedKey: latestCreatedKey.current,
  };
};
