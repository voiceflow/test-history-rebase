import React from 'react';

export * from './MousePositionContext';
export * from './DragContext';
export * from './NamespaceContext';
export * from './OverlayContext';
export * from './ModalsContext';
export * from './HoverContext';
export * from './TextEditorVariablesPopoverContext';

export const ScrollContext = React.createContext('scroll-context');
export const { Consumer: ScrollContextConsumer, Provider: ScrollContextProvider } = ScrollContext;

export const MemoryTabsContext = React.createContext('memory-tabs-context');
export const { Consumer: MemoryTabsContextConsumer, Provider: MemoryTabsContextProvider } = MemoryTabsContext;

export const PropsBridgeContext = React.createContext('props-bridge-context');
export const { Consumer: PropsBridgeContextConsumer, Provider: PropsBridgeContextProvider } = PropsBridgeContext;

export const FeatureFlagContext = React.createContext('feature-flags-contexts');
export const { Consumer: FeatureFlagContextConsumer, Provider: FeatureFlagContextProvider } = FeatureFlagContext;
