import { Utils } from '@voiceflow/common';
import type { CustomScrollbarsTypes } from '@voiceflow/ui';
import React from 'react';

export interface ScrollContextValue<T extends HTMLElement | CustomScrollbarsTypes.Scrollbars> {
  scrollRef: React.RefObject<T>;
  scrollToNode: (node: HTMLElement, padding?: number) => void;
  setScrollBarOffset: VoidFunction;
  scrollHorizontalToNode: (node: HTMLElement, padding?: number) => void;
}

export const ScrollContext = React.createContext<ScrollContextValue<HTMLElement | CustomScrollbarsTypes.Scrollbars>>({
  scrollRef: React.createRef<HTMLElement>(),
  scrollToNode: Utils.functional.noop,
  setScrollBarOffset: Utils.functional.noop,
  scrollHorizontalToNode: Utils.functional.noop,
});

export const { Consumer: ScrollContextConsumer } = ScrollContext;

export const ScrollContextProvider = <T extends HTMLElement | CustomScrollbarsTypes.Scrollbars>({
  value,
  children,
}: React.ProviderProps<ScrollContextValue<T>>): React.ReactElement => (
  <ScrollContext.Provider value={value as ScrollContextValue<HTMLElement | CustomScrollbarsTypes.Scrollbars>}>
    {children}
  </ScrollContext.Provider>
);
