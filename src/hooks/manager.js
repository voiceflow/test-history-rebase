import cuid from 'cuid';
import _ from 'lodash';
import debounce from 'lodash/debounce';
import moize from 'moize';
import React from 'react';

import { hasIdenticalMembers, reorder } from '@/utils/array';
import { identity } from '@/utils/functional';
import {
  addNormalizedByKey,
  addToStartNormalizedByKey,
  denormalize,
  normalize,
  removeNormalizedByKey,
  updateNormalizedByKey,
} from '@/utils/normalized';

import { useForceUpdate } from './forceUpdate';
import { useLazy } from './lazy';

const UNIQUE_TYPES = ['object', 'function'];

const DEBOUNCE_TIMEOUT = 300;

// eslint-disable-next-line import/prefer-default-export
export const useManager = (items, onChange, { factory = identity, getKey, autosave = true, debounced = true, handleRemove } = {}) => {
  const [forceUpdate] = useForceUpdate();
  const keyLookup = React.useRef();
  const normalized = React.useRef();
  const cachedOnChange = React.useRef();
  const latestCreatedKey = React.useRef();

  cachedOnChange.current = onChange;

  const debouncedOnChange = React.useMemo(
    () => (debounced ? debounce((...args) => cachedOnChange.current(...args), DEBOUNCE_TIMEOUT) : cachedOnChange.current),
    [debounced]
  );

  const generateLookupKey = React.useMemo(
    () => moize((value, index) => (value !== null && UNIQUE_TYPES.includes(typeof value) ? value : [value, index])),
    []
  );

  const generateKey = React.useCallback((value) => (getKey ? getKey(value) : cuid.slug()), [getKey]);

  const setDependencies = useLazy(
    () => {
      keyLookup.current = new Map(
        items.map((item, index) => [generateLookupKey(item, index), process.env.NODE_ENV === 'test' ? index : generateKey(item)])
      );
      normalized.current = normalize(items, (item, index) => keyLookup.current.get(generateLookupKey(item, index)));
    },
    [items],
    ([nextItems], [prevItems]) => hasIdenticalMembers(nextItems, prevItems)
  );

  const getItem = React.useCallback((key) => normalized.current.byKey[key], []);

  const getIndex = React.useCallback((key) => normalized.current.allKeys.indexOf(key), []);

  const onSave = React.useCallback(
    (value, { update, save = true } = {}) => {
      const denormalized = denormalize(value);
      if (!update && debouncedOnChange?.cancel) {
        debouncedOnChange.cancel();
      }

      normalized.current = value;
      setDependencies([denormalized]);
      forceUpdate();
      update ? debouncedOnChange(denormalized) : cachedOnChange.current(denormalized, save);
    },
    [debouncedOnChange, setDependencies, forceUpdate]
  );

  const onAdd = React.useCallback(
    (...args) => {
      const value = factory(...args);
      const key = generateKey(value);
      const updated = addNormalizedByKey(normalized.current, key, value);
      const index = updated.allKeys.length - 1;

      keyLookup.current.set(generateLookupKey(value, index), key);

      latestCreatedKey.current = key;

      onSave(updated, { save: autosave });
    },
    [autosave, factory, generateKey, generateLookupKey, onSave]
  );

  const onAddToStart = React.useCallback(
    (...args) => {
      const value = factory(...args);
      const key = generateKey(value);
      const updated = addToStartNormalizedByKey(normalized.current, key, value);
      const index = 0;

      keyLookup.current.set(generateLookupKey(value, index), key);

      latestCreatedKey.current = key;

      onSave(updated, { save: autosave });
    },
    [autosave, factory, generateKey, generateLookupKey, onSave]
  );

  const onReorder = React.useCallback(
    (from, to) => {
      const updated = {
        ...normalized.current,
        allKeys: reorder(normalized.current.allKeys, from, to),
      };

      onSave(updated, { update: true });
    },
    [onSave]
  );

  const onUpdate = React.useCallback(
    (key, value) => {
      const currValue = getItem(key);

      const updated = updateNormalizedByKey(
        normalized.current,
        key,
        currValue && !Array.isArray(currValue) && _.isObject(currValue) ? { ...currValue, ...value } : value
      );
      const index = getIndex(key);
      keyLookup.current.delete(generateLookupKey(currValue, index));
      keyLookup.current.set(generateLookupKey(updated.byKey[key], index), key);
      onSave(updated, { update: true });
    },
    [generateLookupKey, getIndex, getItem, onSave]
  );

  const memoizedUpdate = React.useMemo(() => moize((key) => (value) => onUpdate(key, value)), [onUpdate]);

  const onRemove = React.useCallback(
    async (key) => {
      const currValue = getItem(key);
      const currIndex = getIndex(key);

      const updated = removeNormalizedByKey(normalized.current, key);

      keyLookup.current.delete(generateLookupKey(currValue, currIndex));

      onSave(updated, { save: autosave });

      await handleRemove?.(currValue, currIndex);
    },
    [getItem, getIndex, generateLookupKey, onSave, autosave, handleRemove]
  );

  const memoizedRemove = React.useMemo(() => moize((key) => () => onRemove(key)), [onRemove]);

  const toggleOpen = React.useCallback((key) => onUpdate(key, { open: !getItem(key).open }), [getItem, onUpdate]);

  const memoizedToggle = React.useMemo(() => moize((key) => () => toggleOpen(key)), [toggleOpen]);

  const mapManaged = React.useCallback(
    (render) =>
      normalized.current.allKeys
        .map((key) => [key, getItem(key)])
        .map(([key, value], index) =>
          render(value, {
            key,
            index,
            onUpdate: memoizedUpdate(key),
            onRemove: memoizedRemove(key),
            toggleOpen: memoizedToggle(key),
          })
        ),
    [getItem, memoizedUpdate, memoizedRemove, memoizedToggle]
  );

  return {
    keys: normalized.current.allKeys,
    items,
    onAdd,
    onUpdate,
    onRemove,
    onReorder,
    toggleOpen,
    mapManaged,
    onAddToStart,
    latestCreatedKey: latestCreatedKey.current,
  };
};
