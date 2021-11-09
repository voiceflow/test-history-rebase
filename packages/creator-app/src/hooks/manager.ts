import { Normalized, Utils } from '@voiceflow/common';
// eslint-disable-next-line lodash/import-scope
import type { DebouncedFunc } from 'lodash';
import _debounce from 'lodash/debounce';
import _isObject from 'lodash/isObject';
import moize from 'moize';
import React from 'react';

import { IS_TEST } from '@/config';

import { useForceUpdate } from './forceUpdate';
import { useLazy } from './lazy';

const UNIQUE_TYPES = ['object', 'function'];

const DEBOUNCE_TIMEOUT = 300;

type OnChange<T extends {}> = (items: T[], save?: boolean) => void;

interface MapManagedRenderOptions<T extends {}> {
  key: string;
  index: number;
  onUpdate: (value: Partial<T>) => void;
  onRemove: () => void;
  toggleOpen: () => void;
}
interface MapManagedOptions<T extends {}, F extends any[]> {
  clone?: (initVal: T, targetVal: T) => T;
  getKey?: (value: T) => string;
  factory?: (...args: F) => T;
  maxItems?: number;
  autosave?: boolean;
  debounced?: boolean;
  handleRemove?: (value: T, index: number) => void;
}

export type MapManaged<T extends {}> = (render: (item: T, options: MapManagedRenderOptions<T>) => React.ReactNode) => React.ReactNode[];

export interface MapManagedAPI<T extends {}, F extends any[]> {
  keys: string[];
  items: T[];
  onAdd: (...args: F) => void;
  onUpdate: (key: string, value: Partial<T>) => void;
  onRemove: (key: string) => Promise<void>;
  onReorder: (from: number, to: number) => void;
  toggleOpen: (key: string) => void;
  mapManaged: MapManaged<T>;
  onDuplicate: (to: number, item: T, ...args: F) => void;
  onAddToStart: (...args: F) => void;
  isMaxMatches: boolean;
  latestCreatedKey: string | undefined;
}

export const useManager = <T extends {}, F extends any[]>(
  items: T[] = [],
  onChange: (items: T[], save?: boolean) => void,
  {
    clone = Utils.functional.identity,
    getKey,
    maxItems,
    factory = Utils.functional.identity as any,
    autosave = true,
    debounced = true,
    handleRemove,
  }: MapManagedOptions<T, F> = {}
): MapManagedAPI<T, F> => {
  const keyLookup = React.useRef<Map<T | [T, number], string>>();
  const normalized = React.useRef<Normalized<T>>();
  const cachedOnChange = React.useRef<OnChange<T>>();
  const latestCreatedKey = React.useRef<string>();

  const [forceUpdate] = useForceUpdate();
  const isMaxMatches = maxItems == null ? false : items.length >= maxItems;

  const generateLookupKey = React.useMemo(
    () => moize((value: T, index: number): T | [T, number] => (value !== null && UNIQUE_TYPES.includes(typeof value) ? value : [value, index])),
    []
  );

  const generateKey = React.useCallback((value: T) => getKey?.(value) || Utils.id.cuid.slug(), [getKey]);

  const setDependencies = useLazy(
    () => {
      keyLookup.current = new Map(items.map((item, index) => [generateLookupKey(item, index), IS_TEST ? String(index) : generateKey(item)]));
      normalized.current = Utils.normalized.normalize<T>(items, (item, index) => keyLookup.current!.get(generateLookupKey(item, index))!);
    },
    [items],
    ([nextItems], [prevItems]) => Utils.array.hasIdenticalMembers<T>(nextItems, prevItems)
  );

  cachedOnChange.current = (denormolized: T[], save?: boolean) => {
    setDependencies([denormolized]);
    onChange(denormolized, save);
  };

  const debouncedOnChange = React.useMemo<OnChange<T> | DebouncedFunc<OnChange<T>>>(
    () =>
      debounced
        ? _debounce((denormolized: T[], save?: boolean) => cachedOnChange.current!(denormolized, save), DEBOUNCE_TIMEOUT)
        : cachedOnChange.current!,
    [debounced]
  );

  const getItem = React.useCallback((key: string) => normalized.current!.byKey[key], []);

  const getIndex = React.useCallback((key: string) => normalized.current!.allKeys.indexOf(key), []);

  const onSave = React.useCallback(
    (normalizedValue: Normalized<T>, { update, save = true }: { update?: boolean; save?: boolean } = {}) => {
      const denormalized = Utils.normalized.denormalize(normalizedValue);

      if (!update && 'cancel' in debouncedOnChange) {
        debouncedOnChange.cancel();
      }

      normalized.current = normalizedValue;
      forceUpdate();

      update ? debouncedOnChange(denormalized) : cachedOnChange.current!(denormalized, save);
    },
    [debouncedOnChange, forceUpdate]
  );

  const createKeyValue = React.useCallback(
    (...args: F) => {
      const value = factory(...args);
      const key = generateKey(value);

      return { key, value };
    },
    [factory, generateKey]
  );

  const duplicateKeyValue = React.useCallback(
    (item: any, ...args: F) => {
      const value = clone(factory(...args), item.item);
      const key = generateKey(value);

      return { key, value };
    },
    [factory, generateKey, clone]
  );

  const commitInsert = React.useCallback(
    (key, value, index, updated) => {
      keyLookup.current!.set(generateLookupKey(value, index), key);
      latestCreatedKey.current = key;
      onSave(updated, { save: autosave });
    },
    [onSave, generateLookupKey]
  );

  const onAdd = React.useCallback(
    (...args: F) => {
      if (isMaxMatches) {
        return;
      }

      const { key, value } = createKeyValue(...args);

      const updated = Utils.normalized.addNormalizedByKey(normalized.current!, key, value);
      const index = updated.allKeys.length - 1;

      commitInsert(key, value, index, updated);
    },
    [createKeyValue, commitInsert, isMaxMatches]
  );

  const onAddToStart = React.useCallback(
    (...args: F) => {
      if (isMaxMatches) {
        return;
      }

      const { key, value } = createKeyValue(...args);

      const updated = Utils.normalized.addToStartNormalizedByKey(normalized.current!, key, value);
      const index = 0;

      commitInsert(key, value, index, updated);
    },
    [createKeyValue, commitInsert, isMaxMatches]
  );

  const onDuplicate = React.useCallback(
    (to: number, item: T, ...args: F) => {
      if (isMaxMatches) {
        return;
      }

      const { key, value: dupVal } = duplicateKeyValue(item, ...args);

      const withDupVal = Utils.normalized.addToStartNormalizedByKey(normalized.current!, key, dupVal);
      const dupIndex = to + 1;

      const updated = {
        ...withDupVal,
        allKeys: Utils.array.reorder(withDupVal.allKeys, 0, dupIndex),
      };

      commitInsert(key, dupVal, dupIndex, updated);
    },
    [duplicateKeyValue, commitInsert, isMaxMatches]
  );

  const onReorder = React.useCallback(
    (from: number, to: number) => {
      const updated = {
        ...normalized.current!,
        allKeys: Utils.array.reorder(normalized.current!.allKeys, from, to),
      };

      onSave(updated, { update: true });
    },
    [onSave]
  );

  const onUpdate = React.useCallback(
    (key: string, value: Partial<T>) => {
      const currValue = getItem(key);

      const updated = Utils.normalized.updateNormalizedByKey(
        normalized.current!,
        key,
        currValue && !Array.isArray(currValue) && _isObject(currValue) ? { ...currValue, ...value } : value
      );
      const index = getIndex(key);

      keyLookup.current!.delete(generateLookupKey(currValue, index));
      keyLookup.current!.set(generateLookupKey(updated.byKey[key], index), key);
      onSave(updated, { update: true });
    },
    [generateLookupKey, getIndex, getItem, onSave]
  );

  const memoizedUpdate = React.useMemo(() => moize((key: string) => (value: Partial<T>) => onUpdate(key, value)), [onUpdate]);

  const onRemove = React.useCallback(
    async (key: string) => {
      const currValue = getItem(key);
      const currIndex = getIndex(key);

      const updated = Utils.normalized.removeNormalizedByKey(normalized.current!, key);

      keyLookup.current!.delete(generateLookupKey(currValue, currIndex));

      onSave(updated, { save: autosave });

      await handleRemove?.(currValue, currIndex);
    },
    [getItem, getIndex, generateLookupKey, onSave, autosave, handleRemove]
  );

  const memoizedRemove = React.useMemo(() => moize((key: string) => () => onRemove(key)), [onRemove]);

  const toggleOpen = React.useCallback((key: string) => onUpdate(key, { open: !(getItem(key) as any).open } as Partial<any>), [getItem, onUpdate]);

  const memoizedToggle = React.useMemo(() => moize((key: string) => () => toggleOpen(key)), [toggleOpen]);

  const mapManaged = React.useCallback<MapManaged<T>>(
    (render) =>
      normalized.current!.allKeys.map((key, index) =>
        render(getItem(key), {
          key,
          index,
          onUpdate: memoizedUpdate(key),
          onRemove: memoizedRemove(key),
          toggleOpen: memoizedToggle(key),
        })
      ),
    [getItem, memoizedUpdate, memoizedRemove, memoizedToggle]
  );

  React.useEffect(() => generateLookupKey.clear, [generateLookupKey]);
  React.useEffect(() => memoizedUpdate.clear, [memoizedUpdate]);
  React.useEffect(() => memoizedRemove.clear, [memoizedRemove]);
  React.useEffect(() => memoizedToggle.clear, [memoizedToggle]);

  return {
    keys: normalized.current!.allKeys,
    items,
    onAdd,
    onUpdate,
    onRemove,
    onReorder,
    toggleOpen,
    mapManaged,
    onDuplicate,
    onAddToStart,
    isMaxMatches,
    latestCreatedKey: latestCreatedKey.current,
  };
};
