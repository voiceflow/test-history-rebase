import React from 'react';

import { EngineContext, useNode } from '@/containers/CanvasV2/contexts';
import { withHook } from '@/hocs';

export const useNodeLifecycle = () => {
  const engine = React.useContext(EngineContext);
  const { node, nodeID } = useNode();
  const nodeCache = React.useRef();

  nodeCache.current = node || nodeCache.current;

  // redraw links when rendering
  React.useEffect(() => {
    if (node) {
      engine.node.redrawLinks(nodeID);
    }
  }, [!!node]);

  // redraw links in parent block when unmounting
  React.useEffect(
    () => () => {
      const { parentNode } = nodeCache.current;

      if (parentNode) {
        engine.node.redrawNestedLinks(parentNode);
      }
    },
    []
  );
};

export const withNodeLifecycle = withHook(useNodeLifecycle);
