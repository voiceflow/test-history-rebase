import { Utils } from '@voiceflow/common';
import React, { useMemo, useRef, useState } from 'react';

import type { AtomContextValue } from '../contexts/AtomContext';
import { AtomContext } from '../contexts/AtomContext';

export interface Atom<T> {
  key: string;
  default: T;
  context?: React.Context<AtomContextValue>;
}

type Serializable = string | number | Record<string, string | number | boolean | undefined | null>;

export interface AtomFamily<T> {
  key: string;
  default: T | (() => T);
  family: true;
  update: (value: T) => void;
  context?: React.Context<AtomContextValue>;
}

export interface AtomFactory<T, P extends Serializable> {
  (param: P): AtomFamily<T>;
}

const useAtomContext = (atom: { context?: React.Context<AtomContextValue> }) =>
  React.useContext(atom.context || AtomContext);

export const useAtomFactory = <T, P extends Serializable = never>(
  key: string,
  options: Pick<AtomFamily<T>, 'context'> & { default: T | ((param: P) => T) },
  dependencies: any[] = []
): AtomFactory<T, P> => {
  const atomStore = useAtomContext(options);

  return React.useCallback(
    (param) => {
      const atomKey = `${key}.${JSON.stringify(param)}`;

      return {
        key: atomKey,
        family: true,
        context: options.context,
        default:
          typeof options.default === 'function'
            ? () => (options.default as (param: P) => T)(param as P)
            : options.default,
        update: (next) => {
          const atom = atomStore.atoms.get(atomKey);

          if (atom && atom.value === next) {
            return;
          }

          atomStore.atoms.set(atomKey, { ...atom, value: next, listeners: atom?.listeners ?? [] });
          atom?.listeners.forEach((listener) => listener(next));
        },
      };
    },
    [key, ...dependencies]
  );
};

export const useAtom = <T>(key: string, options: Pick<Atom<T>, 'default' | 'context'>, dependencies: any[] = []) =>
  React.useMemo(
    () => ({
      key,
      default: options.default,
      context: options.context,
    }),
    [key, ...dependencies]
  );

const isDirectlyEqual = <T>(lhs: T, rhs: T) => lhs === rhs;

export const useAtomInitialValue = <T, S = T>(
  atom: Atom<T> | AtomFamily<T>,
  options: { selector?: (value: T) => S; initialValue?: S } = {}
) => {
  const atomStore = useAtomContext(atom);

  return useMemo<S>(() => {
    if (Utils.object.hasProperty(options, 'initialValue')) {
      return options.initialValue!;
    }

    const selector = options.selector || ((value: T): S => value as any);

    const atomEntry = atomStore.atoms.get(atom.key);
    if (atomEntry) {
      return selector(atomEntry.value);
    }

    return selector(typeof atom.default === 'function' ? (atom.default as () => T)() : atom.default);
  }, []);
};

export const useAtomSubscription = <T, S = T>(
  atom: Atom<T> | AtomFamily<T>,
  handler: (value: S) => void,
  options: { selector?: (value: T) => S; isEqual?: (prev: S, next: S) => boolean; initialValue?: S } = {}
): S => {
  const atomStore = useAtomContext(atom);
  const initialValue = useAtomInitialValue(atom, options);
  const prevLocalStateRef = useRef(initialValue);

  React.useEffect(() => {
    const listener = (next: T) => {
      const nextValue = (options?.selector ? options.selector(next) : next) as S;

      if (!(options.isEqual || isDirectlyEqual)(prevLocalStateRef.current, nextValue)) {
        prevLocalStateRef.current = nextValue;
        handler(nextValue);
      }
    };
    let atomEntry = atomStore.atoms.get(atom.key);

    if (!atomEntry) {
      atomEntry = { listeners: [], value: initialValue };
      atomStore.atoms.set(atom.key, atomEntry);
    }

    atomEntry.listeners = Utils.array.append(atomEntry.listeners, listener);

    return () => {
      atomEntry!.listeners = Utils.array.withoutValue(atomEntry!.listeners, listener);
    };
  }, []);

  return initialValue;
};

export const useAtomState = <T, S = T>(
  atom: Atom<T> | AtomFamily<T>,
  options: { selector?: (value: T) => S; isEqual?: (prev: S, next: S) => boolean; initialValue?: S } = {}
): S => {
  const initialValue = useAtomInitialValue(atom, options);
  const [localState, setLocalState] = useState(initialValue);

  useAtomSubscription(atom, setLocalState, {
    ...options,
    ...(Utils.object.hasProperty(options, 'initialValue') && { initialValue: options.initialValue }),
  });

  return localState;
};
