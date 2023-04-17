import _isBoolean from 'lodash/isBoolean';
import React from 'react';

export const useToggle = (defaultValue = false): [boolean, (nextValue?: unknown) => void] => {
  const [value, setValue] = React.useState(defaultValue);

  const toggle = React.useCallback((nextValue: unknown) => setValue((currValue) => (_isBoolean(nextValue) ? nextValue : !currValue)), []);

  return [value, toggle];
};

export const useEnableDisable = (defaultValue = false): [boolean, VoidFunction, VoidFunction] => {
  const [value, toggleValue] = React.useState(defaultValue);
  const onEnable = React.useCallback(() => toggleValue(true), []);
  const onDisable = React.useCallback(() => toggleValue(false), []);

  return [value, onEnable, onDisable];
};

export const useSwitch = (defaultValue: unknown = null): [boolean, unknown, (nextValue: unknown) => void, VoidFunction] => {
  const [{ isSet, value }, setState] = React.useState({ isSet: !!defaultValue, value: defaultValue });
  const onChange = (nextValue: unknown) => setState({ isSet: true, value: nextValue });
  const onUnset = () => isSet && setState((state) => ({ ...state, isSet: false }));

  return [isSet, value, onChange, onUnset];
};
