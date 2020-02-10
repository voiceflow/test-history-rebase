import React from 'react';

import { useToggle } from '@/hooks';

export const HelpModalContext = React.createContext(null);
export const { Consumer: HelpModalConsumer } = HelpModalContext;

export const HelpModalProvider = ({ children }) => {
  const [isEnabled, toggle] = useToggle();
  const [type, setType] = React.useState('');

  return <HelpModalContext.Provider value={{ isEnabled, toggle, type, setType }}>{children}</HelpModalContext.Provider>;
};
