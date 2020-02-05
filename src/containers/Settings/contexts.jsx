import React from 'react';

import { useToggle } from '@/hooks';

import { SettingsRoute } from './constants';

export const SettingsModalContext = React.createContext(null);
export const { Consumer: SettingsModalConsumer } = SettingsModalContext;

export const SettingsModalProvider = ({ children }) => {
  const [isEnabled, toggle] = useToggle();
  const [type, setType] = React.useState(SettingsRoute.BASIC);

  return <SettingsModalContext.Provider value={{ isEnabled, toggle, type, setType }}>{children}</SettingsModalContext.Provider>;
};
