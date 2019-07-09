import { useReducer, useState } from 'react';

export const useToggle = (defaultValue = false) => {
  const [value, toggleValue] = useState(defaultValue);

  return [value, (input) => toggleValue((v) => (typeof input === 'boolean' ? input : !v))];
};

export const useEnableDisable = (defaultValue = false) => {
  const [value, toggleValue] = useState(defaultValue);

  return [value, () => toggleValue(true), () => toggleValue(false)];
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, opened: true, ...payload };
    case 'hide':
      return { ...state, opened: false, ...payload };
    default:
      return state;
  }
};

const createDispatcher = (dispatch, type) => (payload = {}) =>
  dispatch({ type, payload: payload.nativeEvent instanceof window.Event ? undefined : payload });

export const useToggleReducer = (initialState = { opened: false }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, createDispatcher(dispatch, 'show'), createDispatcher(dispatch, 'hide')];
};
