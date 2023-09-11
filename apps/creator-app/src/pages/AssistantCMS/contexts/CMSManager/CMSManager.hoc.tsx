import { atom } from 'jotai';
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import type { CMSManagerStaticConfig, CMSResource, CMSResourceSearchContext } from './CMSManager.interface';
import { CMSManagerProvider } from './CMSManager.provider';

interface WithCMSManagerProvider {
  <Item extends CMSResource, SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext>(
    staticConfig: Exclude<keyof SearchContext, keyof CMSResourceSearchContext> extends never
      ? Omit<CMSManagerStaticConfig<Item, SearchContext>, 'searchContext'> &
          Partial<Pick<CMSManagerStaticConfig<Item, SearchContext>, 'searchContext'>>
      : CMSManagerStaticConfig<Item, SearchContext>
  ): (Component: React.FC) => React.FC;
}

export const withCMSManagerProvider: WithCMSManagerProvider = (staticConfigProp) => {
  const staticConfig = { ...staticConfigProp, searchContext: staticConfigProp.searchContext ?? atom({}) };

  return (Component) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSManagerProvider'))(() => (
      <CMSManagerProvider staticConfig={staticConfig}>
        <Component />
      </CMSManagerProvider>
    ));
};
