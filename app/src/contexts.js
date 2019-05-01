import { createContext } from 'react';

export const ScrollContext = createContext('scroll-context');
export const { Consumer: ScrollContextConsumer, Provider: ScrollContextProvider } = ScrollContext;

export const MemoryTabsContext = createContext('memory-tabs-context');
export const {
  Consumer: MemoryTabsContextConsumer,
  Provider: MemoryTabsContextProvider,
} = MemoryTabsContext;

export const PropsBridgeContext = createContext('props-bridge-context');
export const {
  Consumer: PropsBridgeContextConsumer,
  Provider: PropsBridgeContextProvider,
} = PropsBridgeContext;

export const FeatureFlagContext = createContext('feature-flags-contexts');
export const {
  Consumer: FeatureFlagContextConsumer,
  Provider: FeatureFlagContextProvider,
} = FeatureFlagContext;
