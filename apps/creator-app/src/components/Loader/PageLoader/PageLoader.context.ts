import { Utils } from '@voiceflow/common';
import { createContext } from 'react';

import type { IPageLoaderContext, IPageLoaderProgressContext } from './PageLoader.interface';

export const PageLoaderContext = createContext<IPageLoaderContext>({
  loaded: Utils.functional.noop,
  register: () => Utils.functional.noop,
});

export const PageLoaderProgressContext = createContext<IPageLoaderProgressContext | null>(null);
