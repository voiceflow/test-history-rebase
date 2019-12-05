import React from 'react';

import { withContext } from '@/hocs';

import { EngineContext } from '.';

const DEFAULT_CONTEXT = {
  sourcePortID: null,
  mouseOrigin: null,
};

export const LinkCreationContext = React.createContext(null);
export const { Consumer: LinkCreationConsumer } = LinkCreationContext;

export const LinkCreationProvider = ({ children }) => {
  const engine = React.useContext(EngineContext);
  const [context, setContext] = React.useState(DEFAULT_CONTEXT);
  const [completing, setCompleting] = React.useState();
  const isDrawing = !!context.sourcePortID;

  const onStart = React.useCallback(async (sourcePortID, mouseOrigin) => {
    const linkIDs = engine.getLinkIDsByPortID(sourcePortID);
    if (linkIDs.length) {
      await Promise.all(linkIDs.map((linkID) => engine.link.remove(linkID)));
    }

    setContext({ sourcePortID, mouseOrigin });
  }, []);
  const onAbort = React.useCallback(() => setContext(DEFAULT_CONTEXT), []);
  const onComplete = React.useCallback(
    async (targetPortID) => {
      setCompleting(true);
      await engine.link.add(context.sourcePortID, targetPortID);
      setCompleting(false);
      onAbort();
    },
    [engine, context]
  );

  return (
    <LinkCreationContext.Provider
      value={{ isDrawing, sourcePortID: context.sourcePortID, mouseOrigin: context.mouseOrigin, onStart, onComplete, onAbort, completing }}
    >
      {children}
    </LinkCreationContext.Provider>
  );
};

export const withLinkCreation = withContext(LinkCreationContext, 'linkCreation');
