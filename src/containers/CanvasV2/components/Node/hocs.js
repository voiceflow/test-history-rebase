import React from 'react';

import { EngineContext } from '@/containers/CanvasV2/contexts';
import { withHook } from '@/hocs';

export const useNodeLifecycle = ({ nodeID, node }) => {
  const engine = React.useContext(EngineContext);
  const nodeCache = React.useRef();

  nodeCache.current = node || nodeCache.current;

  // redraw links when rendering
  React.useEffect(() => {
    if (node) {
      engine.node.redrawLinks(nodeID);
    }
  }, [!!node]);

  // update origin when changing position
  React.useEffect(() => {
    if (node) {
      engine.node.setOrigin(nodeID, [node.x, node.y]);
    }
  }, [node?.x, node?.y]);

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
