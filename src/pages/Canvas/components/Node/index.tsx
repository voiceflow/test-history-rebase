import cn from 'classnames';
import cuid from 'cuid';
import React from 'react';

import { BlockType } from '@/constants';
import { useSmartReducerV2 } from '@/hooks';
import { BlockAPI } from '@/pages/Canvas/components/Block';
import CommentBlock from '@/pages/Canvas/components/CommentBlock';
import { ContextMenuTarget, MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';
import { ContextMenuContext, EditPermissionContext, EngineContext, PresentationModeContext, useNode, withNode } from '@/pages/Canvas/contexts';
import { useNodeDragApi } from '@/pages/Canvas/hooks';
import { ClassName } from '@/styles/constants';

import NodeBlock from './components/NodeBlock';
import Container from './components/NodeContainer';
import NodeStartBlock from './components/NodeStartBlock';
import { useNodeLifecycle } from './hooks';

const Node = () => {
  useNodeLifecycle();

  const { nodeID, node, isHighlighted } = useNode();
  const engine = React.useContext(EngineContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);
  const contextMenu = React.useContext(ContextMenuContext)!;
  const { api: dragApi, nodeRef, position, isDragging, onMouseDown } = useNodeDragApi<HTMLDivElement>();

  const instanceID = React.useMemo(() => cuid(), []);
  const blockRef = React.useRef<{ api: BlockAPI }>(null);

  const isFocused = React.useCallback(() => engine.focus.isTarget(nodeID), []);
  const isSelected = React.useCallback(() => engine.selection.isTarget(nodeID), []);

  const onRightClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (node.type !== BlockType.START && editPermission.canEdit) {
        contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeID);
      }
    },
    [editPermission.canEdit]
  );

  const onDoubleClick = React.useCallback(() => engine.node.center(nodeID), []);

  const [state, actions] = useSmartReducerV2({
    isMergeTarget: false,
    isBlockHighlighted: false,
    newSourceNodeIndex: null as null | number,
  } as { isMergeTarget: boolean; isBlockHighlighted: boolean; newSourceNodeIndex: null | number });

  const apiRef = React.useRef({
    instanceID,

    rename: () => blockRef.current?.api.rename?.(),

    getBlockRect: () => blockRef.current!.api.getBoundingClientRect(),

    setHighlight: () => actions.isBlockHighlighted.set(true),

    clearHighlight: () => actions.isBlockHighlighted.set(false),

    setMergeTarget: () => actions.isMergeTarget.set(true),

    clearMergeTarget: () => actions.isMergeTarget.set(false),

    updateBlockColor: (blockColor: string) => blockRef.current?.api.updateBlockColor?.(blockColor),

    setNewSourceNodeIndex: (index: number) => actions.newSourceNodeIndex.set(index),
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

  const { newSourceNodeIndex, isBlockHighlighted, isMergeTarget } = state;
  const shouldRender = node.type !== BlockType.COMMAND;

  if (!shouldRender) {
    return null;
  }

  let nodeEl = null;

  if (node.type === BlockType.COMMENT) {
    nodeEl = <CommentBlock ref={blockRef} />;
  } else {
    if (node.type === BlockType.COMBINED) {
      nodeEl = (
        <NodeBlock
          ref={blockRef}
          canModify={isMergeTarget}
          isFocused={isFocused()}
          isSelected={isSelected()}
          isHighlighted={isBlockHighlighted}
          newSourceNodeIndex={newSourceNodeIndex}
        />
      );
    } else if (node.type === BlockType.START) {
      nodeEl = <NodeStartBlock isFocused={isFocused()} isSelected={isSelected()} ref={blockRef} />;
    }
  }

  return (
    <Container
      ref={nodeRef}
      tabIndex={-1}
      position={position}
      isActive={isHighlighted}
      isTransform={!isPresentationMode}
      className={cn(ClassName.CANVAS_NODE, { [MERGE_ACTIVE_NODE_CLASSNAME]: isMergeTarget })}
      isDragging={isDragging}
      onMouseDown={onMouseDown}
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
    >
      {nodeEl}
    </Container>
  );
};

export default withNode(React.memo(Node));
