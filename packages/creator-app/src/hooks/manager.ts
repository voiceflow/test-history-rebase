import { Eventual, Utils } from '@voiceflow/common';
import { useCachedValue, useCreateConst } from '@voiceflow/ui';
// eslint-disable-next-line lodash/import-scope
import type { DebouncedFunc } from 'lodash';
import _debounce from 'lodash/debounce';
import moize from 'moize';
import * as Normal from 'normal-store';
import React from 'react';

import { IS_TEST } from '@/config';
import { TransactionContext } from '@/contexts/TransactionContext';

import { useForceUpdate } from './forceUpdate';
import { useLazy } from './lazy';

const UNIQUE_TYPES = new Set(['object', 'function']);

const DEBOUNCE_TIMEOUT = 300;

export type OnManagerChange<T extends {}> = (items: T[], save?: boolean) => Eventual<void>;

interface MapManagedRenderOptions<T extends {}> {
  key: string;
  index: number;
  isLast: boolean;
  isFirst: boolean;
  onUpdate: (value: Partial<T>) => void;
  onRemove: () => void;
  toggleOpen: () => void;
}

export interface MapManagedOptions<T extends {}, F extends any[]> {
  clone?: (initVal: T, targetVal: T) => T;
  onAdd?: (value: T, index: number) => Eventual<void>;
  getKey?: (value: T) => string;
  factory?: (...args: F) => T;
  validate?: (value: T, options: { index: number; isUpdate: boolean; originalValue: T | null }) => boolean;
  maxItems?: number;
  autosave?: boolean;
  onRemove?: (value: T, index: number) => Eventual<void>;
  debounced?: boolean;
  onReorder?: (from: number, to: number) => Eventual<void>;

  /**
   * @deprecated use onRemove instead
   */
  handleRemove?: (value: T, index: number) => Eventual<void>;
}

export type MapManaged<T extends {}> = (render: (item: T, options: MapManagedRenderOptions<T>) => React.ReactNode) => React.ReactNode[];

export interface MapManagedAPI<T extends {}, F extends any[]> {
  size: number;
  keys: string[];
  items: T[];
  onAdd: (...args: F) => Promise<void>;
  getIndex: (key: string) => number;
  onUpdate: (key: string, value: Partial<T>) => Promise<void>;
  onRemove: (key: string) => Promise<void>;
  onReorder: (from: number, to: number) => Promise<void>;
  toggleOpen: (key: string) => Promise<void>;
  mapManaged: MapManaged<T>;
  onDuplicate: (to: number, item: T, ...args: F) => Promise<void>;
  onAddToStart: (...args: F) => Promise<void>;
  isMaxMatches: boolean;
  latestCreatedKey: string | undefined;
}

export const useManager = <T extends {}, F extends any[]>(
  items: T[],
  onChange: OnManagerChange<T>,
  {
    clone = Utils.functional.identity,
    onAdd: handleAdd,
    getKey,
    factory = Utils.functional.identity as any,
    validate,
    maxItems,
    autosave = true,
    debounced = true,
    onReorder: handleReorder,
    handleRemove: deprecatedHandleRemove,
    onRemove: handleRemove = deprecatedHandleRemove,
  }: MapManagedOptions<T, F> = {}
  // eslint-disable-next-line sonarjs/cognitive-complexity
): MapManagedAPI<T, F> => {
  const [forceUpdate] = useForceUpdate();

  const defaultKeyLookup = useCreateConst<Map<T | [T, number], string>>(() => new Map());
  const defaultNormalized = useCreateConst<Normal.Normalized<T>>(() => Normal.createEmpty());

  const keyLookup = React.useRef<Map<T | [T, number], string>>(defaultKeyLookup);
  const normalized = React.useRef<Normal.Normalized<T>>(defaultNormalized);
  const latestCreatedKey = React.useRef<string>();

  const isMaxMatches = maxItems == null ? false : items.length >= maxItems;

  const transaction = React.useContext(TransactionContext);
  const generateLookupKey = useCreateConst(() =>
    moize((value: T, index: number): T | [T, number] => (value !== null && UNIQUE_TYPES.has(typeof value) ? value : [value, index]))
  );

  const generateKey = React.useCallback((value: T) => getKey?.(value) || Utils.id.cuid.slug(), [getKey]);

  const setDependencies = useLazy(
    () => {
      keyLookup.current = new Map(items.map((item, index) => [generateLookupKey(item, index), IS_TEST ? String(index) : generateKey(item)]));
      normalized.current = Normal.normalize<T>(items, (item, index) => keyLookup.current.get(generateLookupKey(item, index))!);
    },
    [items],
    ([nextItems], [prevItems]) => Utils.array.hasIdenticalMembers<T>(nextItems, prevItems)
  );

  const cachedOnChange = useCachedValue<OnManagerChange<T>>((denormolized: T[], save?: boolean) => {
    setDependencies([denormolized]);
    onChange(denormolized, save);
  });

  const debouncedOnChange = React.useMemo<OnManagerChange<T> | DebouncedFunc<OnManagerChange<T>>>(
    () =>
      debounced
        ? _debounce((denormolized: T[], save?: boolean) => cachedOnChange.current(denormolized, save), DEBOUNCE_TIMEOUT)
        : cachedOnChange.current,
    [debounced]
  );

  const getItem = React.useCallback((key: string) => normalized.current.byKey[key], []);

  const getIndex = React.useCallback((key: string) => normalized.current.allKeys.indexOf(key), []);

  const onSave = React.useCallback(
    async (normalizedValue: Normal.Normalized<T>, { update, save = true }: { update?: boolean; save?: boolean } = {}) => {
      const denormalized = Normal.denormalize(normalizedValue);

      if (!update && 'cancel' in debouncedOnChange) {
        debouncedOnChange.cancel();
      }

      normalized.current = normalizedValue;
      forceUpdate();

      if (update) {
        await debouncedOnChange(denormalized);
      } else {
        cachedOnChange.current(denormalized, save);
      }
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
    async (key, value, index, updated) => {
      keyLookup.current.set(generateLookupKey(value, index), key);
      latestCreatedKey.current = key;

      await Promise.all([onSave(updated, { save: autosave }), handleAdd?.(value, index)]);
    },
    [onSave, generateLookupKey, handleAdd]
  );

  const onAdd = React.useCallback(
    async (...args: F) => {
      if (isMaxMatches) return;

      const index = normalized.current.allKeys.length;
      const { key, value } = createKeyValue(...args);

      if (validate?.(value, { index, isUpdate: false, originalValue: null }) === false) return;

      const updated = Normal.appendOne(normalized.current, key, value);

      await transaction(() => commitInsert(key, value, index, updated));
    },
    [createKeyValue, commitInsert, isMaxMatches, validate]
  );

  const onAddToStart = React.useCallback(
    async (...args: F) => {
      if (isMaxMatches) return;

      const index = 0;
      const { key, value } = createKeyValue(...args);

      if (validate?.(value, { index, isUpdate: false, originalValue: null }) === false) return;

      const updated = Normal.prependOne(normalized.current, key, value);

      await transaction(() => commitInsert(key, value, index, updated));
    },
    [createKeyValue, commitInsert, isMaxMatches, validate]
  );

  const onDuplicate = React.useCallback(
    async (to: number, item: T, ...args: F) => {
      if (isMaxMatches) return;

      const { key, value: dupVal } = duplicateKeyValue(item, ...args);

      const withDupVal = Normal.prependOne(normalized.current, key, dupVal);
      const dupIndex = to + 1;

      const updated = {
        ...withDupVal,
        allKeys: Utils.array.reorder(withDupVal.allKeys, 0, dupIndex),
      };

      await transaction(() => commitInsert(key, dupVal, dupIndex, updated));
    },
    [duplicateKeyValue, commitInsert, isMaxMatches, handleAdd]
  );

  const onReorder = React.useCallback(
    async (from: number, to: number) => {
      const updated = {
        ...normalized.current,
        allKeys: Utils.array.reorder(normalized.current.allKeys, from, to),
      };

      await transaction(async () => {
        await Promise.all([onSave(updated, { update: true }), handleReorder?.(from, to)]);
      });
    },
    [onSave, handleReorder]
  );

  const onUpdate = React.useCallback(
    async (key: string, value: Partial<T>) => {
      const index = getIndex(key);
      const currValue = getItem(key);

      const nextValue = currValue && !Array.isArray(currValue) && Utils.object.isObject(currValue) ? { ...currValue, ...value } : (value as T);

      if (validate?.(nextValue, { index, isUpdate: true, originalValue: currValue }) === false) return;

      const updated = Utils.normalized.updateNormalizedByKey(normalized.current, key, nextValue);

      keyLookup.current.delete(generateLookupKey(currValue, index));
      keyLookup.current.set(generateLookupKey(updated.byKey[key], index), key);

      await transaction(() => onSave(updated, { update: true }));
    },
    [generateLookupKey, getIndex, getItem, onSave]
  );

  const memoizedUpdate = React.useMemo(() => moize((key: string) => (value: Partial<T>) => onUpdate(key, value)), [onUpdate]);

  const onRemove = React.useCallback(
    async (key: string) => {
      const currValue = getItem(key);
      const currIndex = getIndex(key);

      const updated = Normal.removeOne(normalized.current, key);

      keyLookup.current.delete(generateLookupKey(currValue, currIndex));

      await transaction(async () => {
        await Promise.all([onSave(updated, { save: autosave }), handleRemove?.(currValue, currIndex)]);
      });
    },
    [getItem, getIndex, generateLookupKey, onSave, autosave, handleRemove]
  );

  const memoizedRemove = React.useMemo(() => moize((key: string) => () => onRemove(key)), [onRemove]);

  const toggleOpen = React.useCallback((key: string) => onUpdate(key, { open: !(getItem(key) as any).open } as Partial<any>), [getItem, onUpdate]);

  const memoizedToggle = React.useMemo(() => moize((key: string) => () => toggleOpen(key)), [toggleOpen]);

  const mapManaged = React.useCallback<MapManaged<T>>(
    (render) =>
      normalized.current.allKeys.map((key, index) =>
        render(getItem(key), {
          key,
          index,
          isLast: index === normalized.current.allKeys.length - 1,
          isFirst: index === 0,
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
    size: normalized.current.allKeys.length,
    keys: normalized.current.allKeys,
    items,
    onAdd,
    getIndex,
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
