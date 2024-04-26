import React from 'react';

import type { BaseItemData } from './types';

interface ChildrenContextValue<Item> {
  renderItem: (data: BaseItemData<Item>) => React.ReactNode;
}

const Context = React.createContext<ChildrenContextValue<any>>({ renderItem: () => null });

export const { Provider: ChildrenContextProvider } = Context;

export const useChildrenContext = <Item extends unknown>(): ChildrenContextValue<Item> => React.useContext(Context);
