import React from 'react';

export * from './DragContext';
export * from './EventualEngineContext';
export * from './HoverContext';
export * from './IdentityContext';
export * from './ModalsContext';
export * from './MousePositionContext';
export * from './NamespaceContext';
export * from './OverlayContext';
export * from './TextEditorVariablesPopoverContext';

export type ScrollContextValue = {
  scrollToNode: (node: HTMLElement, padding?: number) => void;
  setScrollBarOffset: () => void;
  scrollHorizontalToNode: (node: HTMLElement, padding?: number) => void;
};

export const ScrollContext = React.createContext<ScrollContextValue | null>(null);
export const { Consumer: ScrollContextConsumer, Provider: ScrollContextProvider } = ScrollContext;

export const MemoryTabsContext = React.createContext('memory-tabs-context');
export const { Consumer: MemoryTabsContextConsumer, Provider: MemoryTabsContextProvider } = MemoryTabsContext;

export const PropsBridgeContext = React.createContext('props-bridge-context');
export const { Consumer: PropsBridgeContextConsumer, Provider: PropsBridgeContextProvider } = PropsBridgeContext;

export const FeatureFlagContext = React.createContext('feature-flags-contexts');
export const { Consumer: FeatureFlagContextConsumer, Provider: FeatureFlagContextProvider } = FeatureFlagContext;
