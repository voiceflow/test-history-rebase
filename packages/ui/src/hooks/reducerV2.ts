/* eslint-disable @typescript-eslint/ban-types */
import _transform from 'lodash/transform';
import React, { useReducer, useRef } from 'react';

enum ActionType {
  SET = 'set',
  UPDATE = 'update',
  KEY_SET = 'key-set',
  KEY_TOGGLE = 'key-toggle',
  KEY_UPDATE = 'key-update',
}

type SetAction<S extends {}> = { type: ActionType.SET; payload: S };
type UpdateAction<S extends {}> = { type: ActionType.UPDATE; payload: Partial<S> };
type KeySetAction<S extends {}, K extends keyof S> = { type: ActionType.KEY_SET; key: K; payload: S[K] };
type KeyToggleAction<S extends {}, K extends keyof S> = { type: ActionType.KEY_TOGGLE; key: K; payload?: never };
type KeyUpdateAction<S extends {}, K extends keyof S> = { type: ActionType.KEY_UPDATE; key: K; payload: Partial<S[K]> };

type Action<S extends {}, K extends keyof S> = SetAction<S> | UpdateAction<S> | KeySetAction<S, K> | KeyToggleAction<S, K> | KeyUpdateAction<S, K>;

type CustomReducer<S extends {}> = (state: S, action: Action<S, keyof S>) => S;

const getTopLevelDiff = (object: Record<string, any>, base: Record<string, any>) => {
  const changes = (object: Record<string, any>, base: Record<string, any>) =>
    _transform<Record<string, any>, Record<string, any>>(object, (result, value, key) => {
      if (value !== base[key]) {
        // eslint-disable-next-line no-param-reassign
        result[key] = value;
      }
    });
  return changes(object, base);
};

const createSmartReducer =
  <S extends {}, K extends keyof S>(customReducer: CustomReducer<S>) =>
  (state: S, action: Action<S, K>) => {
    switch (action.type) {
      case ActionType.SET:
        return action.payload;
      case ActionType.UPDATE:
        return { ...state, ...action.payload };
      case ActionType.KEY_SET:
        return { ...state, [action.key]: action.payload };
      case ActionType.KEY_TOGGLE:
        return { ...state, [action.key]: !state[action.key] };
      case ActionType.KEY_UPDATE:
        return { ...state, [action.key]: { ...state[action.key], ...action.payload } };
      default:
        return customReducer(state, action);
    }
  };

type KeyApi<P> = {
  set: (payload: P) => void;
  clear: () => void;
  toggle: () => void;
  update: (payload: Partial<P>) => void;
};

type API<S extends {}> = {
  set: (payload: S) => void;
  reset: () => void;
  update: (payload: Partial<S>) => void;
} & { [K in keyof S]: KeyApi<S[K]> };

export const useSmartReducerV2 = <S extends {}, R extends {} = {}>(
  defaultState: S,
  customReducer: CustomReducer<S> = (s) => s,
  customApiBuilder: (defaultState: S, api: { [K in keyof S]: KeyApi<S[K]> }) => R = () => ({} as any)
) => {
  const apiRef = useRef(null as null | (API<S> & R));
  const [state, dispatch] = useReducer(createSmartReducer(customReducer), defaultState);

  if (!apiRef.current) {
    const keyAPI = (Object.keys(defaultState) as (keyof S)[]).reduce<{ [K in keyof S]: KeyApi<S[K]> }>(
      (api, key) =>
        Object.assign(api, {
          [key]: {
            set: (payload: S[typeof key]) => dispatch({ type: ActionType.KEY_SET, key, payload }),
            clear: () => dispatch({ type: ActionType.KEY_SET, key, payload: defaultState[key] }),
            toggle: () => dispatch({ type: ActionType.KEY_TOGGLE, key }),
            update: (payload: Partial<S[typeof key]>) => dispatch({ type: ActionType.KEY_UPDATE, key, payload }),
          },
        }),
      {} as { [K in keyof S]: KeyApi<S[K]> }
    );

    apiRef.current = {
      set: (payload: S) => dispatch({ type: ActionType.SET, payload }),
      update: (payload: Partial<S>) => dispatch({ type: ActionType.UPDATE, payload }),
      reset: () => dispatch({ type: ActionType.SET, payload: defaultState }),
      ...keyAPI,
      ...customApiBuilder(defaultState, apiRef.current!),
    };
  }

  return [state, apiRef.current!] as const;
};

export const useSyncedSmartReducerV2 = <S extends {}>(props: S) => {
  const cache = React.useRef(props);
  const [state, actions] = useSmartReducerV2(props);

  React.useEffect(() => {
    const diff = getTopLevelDiff(props, cache.current);

    if (Object.keys(diff).length) {
      actions.update(diff);
      cache.current = props;
    }
  }, Object.values(props));

  return [state, actions] as const;
};
