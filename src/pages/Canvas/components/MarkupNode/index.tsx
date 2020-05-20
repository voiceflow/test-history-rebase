import cuid from 'cuid';
import _noop from 'lodash/noop';
import React from 'react';

import { Markup, NodeData } from '@/models';
import DraggingNode from '@/pages/Canvas/components/DraggingNode';
import { EngineContext, ManagerContext, PresentationModeContext, useNode, useNodeData, withNode } from '@/pages/Canvas/contexts';
import { useNodeDragApi } from '@/pages/Canvas/hooks';

const MarkupNode = () => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);
  const { nodeID, node } = useNode();
  const { data } = useNodeData();
  const { markupNode: NodeComponent } = getManager(node?.type)!;

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
      {NodeComponent && <NodeComponent node={node} data={data as NodeData<Markup.NodeData>} />}
    </DraggingNode>
  );
};

export default withNode(MarkupNode);
