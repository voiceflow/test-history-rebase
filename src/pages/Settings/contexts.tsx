import React from 'react';

import { useToggle } from '@/hooks';

import { SettingsRoute } from './constants';

export type SettingsModalValue = {
  isEnabled: boolean;
  toggle: () => void;
  type: SettingsRoute;
  setType: (route: SettingsRoute) => void;
};

export const SettingsModalContext = React.createContext<SettingsModalValue | null>(null);
export const { Consumer: SettingsModalConsumer } = SettingsModalContext;

export const SettingsModalProvider: React.FC = ({ children }) => {
  const [isEnabled, toggle] = useToggle();
  const [type, setType] = React.useState(SettingsRoute.BASIC);

  return <SettingsModalContext.Provider value={{ isEnabled, toggle, type, setType }}>{children}</SettingsModalContext.Provider>;
};
