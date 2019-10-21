import React from 'react';

import { useToggle } from '@/hooks';

export const SettingsModalContext = React.createContext(null);
export const { Consumer: SettingsModalConsumer } = SettingsModalContext;

export const SettingsModalProvider = ({ children }) => {
  const [isEnabled, toggle] = useToggle();
  const [type, setType] = React.useState('');

  return <SettingsModalContext.Provider value={{ isEnabled, toggle, type, setType }}>{children}</SettingsModalContext.Provider>;
};
