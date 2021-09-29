import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';

export interface ScrollContextValue<T extends HTMLElement | Scrollbars> {
  scrollRef: React.RefObject<T>;
  scrollToNode: (node: HTMLElement, padding?: number) => void;
  setScrollBarOffset: VoidFunction;
  scrollHorizontalToNode: (node: HTMLElement, padding?: number) => void;
}

export const ScrollContext = React.createContext<ScrollContextValue<HTMLElement | Scrollbars> | null>(null);
export const { Consumer: ScrollContextConsumer } = ScrollContext;

// eslint-disable-next-line xss/no-mixed-html
export const ScrollContextProvider = <T extends HTMLElement | Scrollbars>({
  value,
  children,
}: React.ProviderProps<ScrollContextValue<T>>): React.ReactElement => (
  <ScrollContext.Provider value={value as ScrollContextValue<HTMLElement | Scrollbars>}>{children}</ScrollContext.Provider>
);

export const PropsBridgeContext = React.createContext('props-bridge-context');
export const { Consumer: PropsBridgeContextConsumer, Provider: PropsBridgeContextProvider } = PropsBridgeContext;
