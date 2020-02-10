import React from 'react';

import { withHook } from '@/hocs';
import { EngineContext, useLink } from '@/pages/Canvas/contexts';

export const useLinkLifecycle = () => {
  const engine = React.useContext(EngineContext);
  const { link } = useLink();
  const linkCache = React.useRef();

  linkCache.current = link || linkCache.current;

  // redraw ports once link is available
  React.useEffect(() => {
    if (link) {
      engine.link.redrawPorts(link);
    }
  }, [!!link]);

  // redraw linked ports on unmount
  React.useEffect(() => () => engine.link.redrawPorts(linkCache.current), []);
};

export const withLinkLifecycle = withHook(useLinkLifecycle);
