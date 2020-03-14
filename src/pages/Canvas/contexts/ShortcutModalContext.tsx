import React from 'react';

import { useToggle } from '@/hooks';

export type ShortcutModalContextType = { isEnabled: boolean; toggle: Function };

export const ShortcutModalContext = React.createContext<ShortcutModalContextType | null>(null);
export const { Consumer: ShortcutModalConsumer } = ShortcutModalContext;

export const ShortcutModalProvider: React.FC = ({ children }) => {
  const [isEnabled, toggle] = useToggle();

  return <ShortcutModalContext.Provider value={{ isEnabled, toggle }}>{children}</ShortcutModalContext.Provider>;
};
