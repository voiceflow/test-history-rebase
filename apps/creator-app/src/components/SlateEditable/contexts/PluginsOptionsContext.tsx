import React from 'react';

import { PluginsOptions } from '../editor';

const PluginsOptionsContext = React.createContext<PluginsOptions>({});

export const { Provider: PluginsOptionsContextProvider } = PluginsOptionsContext;

// rerenders on each editor change(includes selection and etc)
export const usePluginOptions = <T extends keyof PluginsOptions>(type: T): PluginsOptions[T] => React.useContext(PluginsOptionsContext)[type];
