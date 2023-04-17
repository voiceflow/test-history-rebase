import { Utils } from '@voiceflow/common';
import _upperFirst from 'lodash/upperFirst';
import React, { useReducer, useRef } from 'react';

export const TYPE = {
  set: 'set',
  update: 'update',
  key_set: 'key-set',
  key_toggle: 'key-toggle',
  key_update: 'key-update',
};

const createSmartReducer =
  (customReducer) =>
  (state, { type, key, payload }) => {
    switch (type) {
      case TYPE.set:
        return payload;
      case TYPE.update:
        return { ...state, ...payload };
      case TYPE.key_set:
        return { ...state, [key]: payload };
      case TYPE.key_toggle:
        return { ...state, [key]: !state[key] };
      case TYPE.key_update:
        return { ...state, [key]: { ...state[key], ...payload } };
      default:
        return customReducer(state, { type, key, payload });
    }
  };

export const useSmartReducer = (defaultState, customReducer = (s) => s, customApiBuilder = () => ({})) => {
  const apiRef = useRef();
  const [state, dispatch] = useReducer(createSmartReducer(customReducer), defaultState);

  if (!apiRef.current) {
    apiRef.current = Object.keys(defaultState).reduce(
      (api, key) =>
        Object.assign(api, {
          [`set${_upperFirst(key)}`]: (payload) => dispatch({ type: TYPE.key_set, key, payload }),
          [`toggle${_upperFirst(key)}`]: () => dispatch({ type: TYPE.key_toggle, key }),
          [`update${_upperFirst(key)}`]: (payload) => dispatch({ type: TYPE.key_update, key, payload }),
        }),
      {}
    );

    apiRef.current = {
      set: (payload) => dispatch({ type: TYPE.set, payload }),
      update: (payload) => dispatch({ type: TYPE.update, payload }),
      reset: () => dispatch({ type: TYPE.set, defaultState }),
      ...apiRef.current,
      ...customApiBuilder(defaultState, apiRef.current),
    };
  }

  return [state, apiRef.current];
};

export const useSyncedSmartReducer = (props) => {
  const cache = React.useRef(props);
  const [state, actions] = useSmartReducer(props);

  React.useEffect(() => {
    const diff = Utils.object.getTopLevelDiff(props, cache.current);

    if (Object.keys(diff).length) {
      actions.update(diff);
      cache.current = props;
    }
  }, Object.values(props));

  return [state, actions];
};
