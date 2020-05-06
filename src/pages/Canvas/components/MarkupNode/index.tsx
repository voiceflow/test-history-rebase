import cuid from 'cuid';
import _noop from 'lodash/noop';
import React from 'react';

import DraggingNode from '@/pages/Canvas/components/DraggingNode';
import { EngineContext, PresentationModeContext, useNode, withNode } from '@/pages/Canvas/contexts';
import { useNodeDragApi } from '@/pages/Canvas/hooks';

const Node = () => {
  const { nodeID } = useNode();
  const engine = React.useContext(EngineContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);

  const { api: dragApi, nodeRef, position, isDragging, onMouseDown } = useNodeDragApi<HTMLDivElement>();

  const instanceID = React.useMemo(() => cuid(), []);

  const isFocused = React.useCallback(() => engine.focus.isTarget(nodeID), []);

  // TODO: implement context menu
  const onRightClick = React.useCallback(_noop, []);

  const onDoubleClick = React.useCallback(() => engine.node.center(nodeID), []);

  const apiRef = React.useRef({
    instanceID,

    rename: _noop,
  });

  React.useEffect(() => {
    engine.registerNode(nodeID, {
      ...dragApi,
      ...apiRef.current,
    });

    if (isFocused()) {
      nodeRef.current?.focus();
    }

    return () => {
      engine.expireNode(nodeID, instanceID);
    };
  }, []);

  return (
    <DraggingNode
      ref={nodeRef}
      tabIndex={-1}
      position={position}
      isTransform={!isPresentationMode}
      isDragging={isDragging}
      onMouseDown={onMouseDown}
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
    >
      {/* TODO: add markup node here */}
      <div style={{ width: '100px', height: '100px', background: '#ffeeff' }} />
    </DraggingNode>
  );
};

export default withNode(Node);
