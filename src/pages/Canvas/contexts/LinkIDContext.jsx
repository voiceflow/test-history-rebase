import React from 'react';

import { withHook } from '@/hocs';

import { EngineContext } from './EngineContext';

export const LinkIDContext = React.createContext(null);
export const { Provider: LinkIDProvider, Consumer: LinkIDConsumer } = LinkIDContext;

export const useLink = () => {
  const linkID = React.useContext(LinkIDContext);
  const engine = React.useContext(EngineContext);

  return engine.dispatcher.useLink(linkID);
};

export const withLink = withHook(useLink, {
  shouldRender: ({ link, points }) => link && points,
});
