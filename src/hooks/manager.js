import cuid from 'cuid';
import moize from 'moize';
import React from 'react';

import { hasIdenticalMembers, reorder } from '@/utils/array';
import { identity } from '@/utils/functional';
import { addNormalizedByKey, denormalize, normalize, removeNormalizedByKey, updateNormalizedByKey } from '@/utils/normalized';

import { useLazy } from './lazy';

const UNIQUE_TYPES = ['object', 'function'];

// eslint-disable-next-line import/prefer-default-export
export const useManager = (items, onChange, { factory = identity, getKey } = {}) => {
  const keyLookup = React.useRef();
  const normalized = React.useRef();

  const generateLookupKey = React.useCallback(
    moize((value, index) => (value !== null && UNIQUE_TYPES.includes(typeof value) ? value : [value, index])),
    []
  );

  const generateKey = React.useCallback((value) => (getKey ? getKey(value) : cuid.slug()), []);

  const setDependencies = useLazy(
    () => {
      // eslint-disable-next-line compat/compat
      keyLookup.current = new Map(items.map((item, index) => [generateLookupKey(item, index), generateKey(item)]));
      normalized.current = normalize(items, (item, index) => keyLookup.current.get(generateLookupKey(item, index)));
    },
    [items],
    ([nextItems], [prevItems]) => hasIdenticalMembers(nextItems, prevItems)
  );

  const getItem = React.useCallback((key) => normalized.current.byKey[key], []);

  const getIndex = React.useCallback((key) => normalized.current.allKeys.indexOf(key), []);

  const onSave = React.useCallback(
    (value) => {
      const denormalized = denormalize(value);

      normalized.current = value;
      setDependencies([denormalized]);
      onChange(denormalized);
    },
    [onChange]
  );

  const onAdd = React.useCallback(
    (...args) => {
      const value = factory(...args);
      const key = generateKey(value);
      const updated = addNormalizedByKey(normalized.current, key, value);

      keyLookup.current.set(generateLookupKey(value, updated.allKeys.length - 1), key);

      onSave(updated);
    },
    [factory, onSave]
  );

  const onReorder = React.useCallback(
    (from, to) => {
      const updated = {
        ...normalized.current,
        allKeys: reorder(normalized.current.allKeys, from, to),
      };

      onSave(updated);
    },
    [onSave]
  );

  const onUpdate = React.useCallback(
    (key) => (value) => {
      const currValue = getItem(key);

      const updated = updateNormalizedByKey(
        normalized.current,
        key,
        currValue && !Array.isArray(currValue) && typeof currValue === 'object' ? { ...currValue, ...value } : value
      );

      const index = getIndex(key);
      keyLookup.current.delete(generateLookupKey(currValue), index);
      keyLookup.current.set(generateLookupKey(updated.byKey[key], index), key);

      onSave(updated);
    },
    [onSave]
  );

  const onRemove = React.useCallback(
    (key) => () => {
      const updated = removeNormalizedByKey(normalized.current, key);

      keyLookup.current.delete(generateLookupKey(getItem(key), getIndex(key)));

      onSave(updated);
    },
    [onSave]
  );

  const toggleOpen = React.useCallback((key) => () => onUpdate(key)({ open: !getItem(key).open }), [onUpdate]);

  const mapManaged = (render) =>
    normalized.current.allKeys
      .map((key) => [key, getItem(key)])
      .map(([key, value], index) =>
        render(value, {
          key,
          index,
          onUpdate: onUpdate(key),
          onRemove: onRemove(key),
          toggleOpen: toggleOpen(key),
        })
      );

  return {
    items,
    onUpdate,
    onRemove,
    onAdd,
    onReorder,
    toggleOpen,
    mapManaged,
  };
};
