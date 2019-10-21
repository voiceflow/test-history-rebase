import React from 'react';

import { useToggle } from '@/hooks';

export const ShortcutModalContext = React.createContext(null);
export const { Consumer: ShortcutModalConsumer } = ShortcutModalContext;

export const ShortcutModalProvider = ({ children }) => {
  const [isEnabled, toggle] = useToggle();

  return <ShortcutModalContext.Provider value={{ isEnabled, toggle }}>{children}</ShortcutModalContext.Provider>;
};
