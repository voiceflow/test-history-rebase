import { CustomScrollbarsTypes } from '@voiceflow/ui';
import React from 'react';

export type PlaceholderRenderer = (props: { width?: number | string; height?: number | string }) => React.ReactNode;

interface ScrollBarContextValue {
  ref?: React.Ref<CustomScrollbarsTypes.Scrollbars>;
  header?: React.ReactNode;
  renderPlaceholder?: PlaceholderRenderer;
  size?: number;
}

const Context = React.createContext<ScrollBarContextValue>({});

export const { Provider: ScrollBarContextProvider } = Context;

export const useScrollBarContext = () => React.useContext(Context);
