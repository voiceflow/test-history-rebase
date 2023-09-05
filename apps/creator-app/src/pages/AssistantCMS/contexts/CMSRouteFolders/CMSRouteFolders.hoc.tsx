import React from 'react';

import { hocComponentFactory } from '@/utils/hoc.util';

import type { ICMSRouteFoldersProvider } from './CMSRouteFolders.interface';
import { CMSRouteFoldersProvider } from './CMSRouteFolders.provider';

export const withCMSRouteFolders = (config: Omit<ICMSRouteFoldersProvider, 'Component'>) => (Component: React.FC) =>
  hocComponentFactory(Component, 'withCMSRouteFolders')(() => <CMSRouteFoldersProvider {...config} Component={Component} />);
