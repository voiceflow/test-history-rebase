import React from 'react';

export * from './DragContext';
export * from './EventualEngineContext';
export * from './FeatureFlagsContext';
export * from './HoverContext';
export * from './IdentityContext';
export * from './ModalsContext';
export * from './MousePositionContext';
export * from './NamespaceContext';
export * from './TextEditorVariablesPopoverContext';

export type ScrollContextValue = {
  scrollToNode: (node: HTMLElement, padding?: number) => void;
  setScrollBarOffset: () => void;
  scrollHorizontalToNode: (node: HTMLElement, padding?: number) => void;
};

export const ScrollContext = React.createContext<ScrollContextValue | null>(null);
export const { Consumer: ScrollContextConsumer, Provider: ScrollContextProvider } = ScrollContext;

export const PropsBridgeContext = React.createContext('props-bridge-context');
export const { Consumer: PropsBridgeContextConsumer, Provider: PropsBridgeContextProvider } = PropsBridgeContext;
