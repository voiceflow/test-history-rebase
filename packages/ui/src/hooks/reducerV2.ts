import { Nullable, Utils } from '@voiceflow/common';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-function
import _isFunction from 'lodash/isFunction';
import _transform from 'lodash/transform';
import React, { useReducer, useRef } from 'react';

enum ActionType {
  SET = 'set',
  UPDATE = 'update',
  KEY_SET = 'key-set',
  KEY_TOGGLE = 'key-toggle',
  KEY_UPDATE = 'key-update',
}

type SetCallback<S> = (state: S) => S;
type UpdateCallback<S> = (state: S) => Partial<S>;

interface SetAction<S extends object> {
  type: ActionType.SET;
  payload: S | SetCallback<S>;
}
interface UpdateAction<S extends object> {
  type: ActionType.UPDATE;
  payload: Partial<S> | UpdateCallback<S>;
}
interface KeySetAction<S extends object, K extends keyof S> {
  type: ActionType.KEY_SET;
  key: K;
  payload: S[K] | SetCallback<S[K]>;
}
interface KeyToggleAction<S extends object, K extends keyof S> {
  type: ActionType.KEY_TOGGLE;
  key: K;
  payload?: never;
}
interface KeyUpdateAction<S extends object, K extends keyof S> {
  type: ActionType.KEY_UPDATE;
  key: K;
  payload: Partial<S[K]> | UpdateCallback<S[K]>;
}

type Action<S extends object, K extends keyof S> =
  | SetAction<S>
  | UpdateAction<S>
  | KeySetAction<S, K>
  | KeyToggleAction<S, K>
  | KeyUpdateAction<S, K>;

type CustomReducer<S extends object> = (state: S, action: Action<S, keyof S>) => S;

const createSmartReducer =
  <S extends object, K extends keyof S>(customReducer: CustomReducer<S>) =>
  (state: S, action: Action<S, K>) => {
    switch (action.type) {
      case ActionType.SET:
        return _isFunction(action.payload) ? action.payload(state) : action.payload;
      case ActionType.UPDATE:
        return { ...state, ...(_isFunction(action.payload) ? action.payload(state) : action.payload) };
      case ActionType.KEY_SET:
        return {
          ...state,
          [action.key]: _isFunction(action.payload) ? action.payload(state[action.key]) : action.payload,
        };
      case ActionType.KEY_TOGGLE:
        return { ...state, [action.key]: !state[action.key] };
      case ActionType.KEY_UPDATE:
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            ...(_isFunction(action.payload) ? action.payload(state[action.key]) : action.payload),
          },
        };
      default:
        return customReducer(state, action);
    }
  };

interface KeyApi<S> {
  set: (payload: S | SetCallback<S>) => void;
  clear: () => void;
  toggle: () => void;
  update: (payload: Partial<S> | UpdateCallback<S>) => void;
}

export type SmartReducerAPi<S extends object> = {
  set: (payload: S | SetCallback<S>) => void;
  reset: () => void;
  update: (payload: Partial<S> | UpdateCallback<S>) => void;
} & { [K in keyof S]: KeyApi<S[K]> };

export const useSmartReducerV2 = <S extends object>(
  defaultState: S,
  customReducer: CustomReducer<S> = (s) => s,
  customApiBuilder: <R extends object>(defaultState: S, api: { [K in keyof S]: KeyApi<S[K]> }) => R = () => ({} as any)
) => {
  const apiRef = useRef(null as Nullable<SmartReducerAPi<S> & ReturnType<typeof customApiBuilder>>);
  const [state, dispatch] = useReducer(createSmartReducer(customReducer), defaultState);

  if (!apiRef.current) {
    const keyAPI = Utils.object.getKeys(defaultState).reduce<{ [K in keyof S]: KeyApi<S[K]> }>(
      (api, key) =>
        Object.assign(api, {
          [key]: {
            set: (payload: S[typeof key] | SetCallback<S[typeof key]>) => dispatch({ type: ActionType.KEY_SET, key, payload }),
            clear: () => dispatch({ type: ActionType.KEY_SET, key, payload: defaultState[key] }),
            toggle: () => dispatch({ type: ActionType.KEY_TOGGLE, key }),
            update: (payload: Partial<S[typeof key]> | UpdateCallback<S[typeof key]>) => dispatch({ type: ActionType.KEY_UPDATE, key, payload }),
          },
        }),
      {} as { [K in keyof S]: KeyApi<S[K]> }
    );

    apiRef.current = {
      set: (payload: S | SetCallback<S>) => dispatch({ type: ActionType.SET, payload }),
      update: (payload: Partial<S> | UpdateCallback<S>) => dispatch({ type: ActionType.UPDATE, payload }),
      reset: () => dispatch({ type: ActionType.SET, payload: defaultState }),
      ...keyAPI,
      ...customApiBuilder(defaultState, apiRef.current!),
    };
  }

  return [state, apiRef.current!] as const;
};

const getTopLevelDiff = <S extends object>(object: S, base: S): Partial<S> => {
  const changes = (object: S, base: S) =>
    _transform<S, S>(object, (result, value, key) => {
      if (value !== base[key]) {
        // eslint-disable-next-line no-param-reassign
        result[key] = value;
      }
    });

  return changes(object, base);
};

export const useSyncedSmartReducerV2 = <S extends object>(props: S) => {
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
