import React from 'react';

import { BlockType } from '@/constants';
import { useSetup } from '@/hooks';
import CommentBlock from '@/pages/Canvas/components/CommentBlock';
import { useNodeDrag, useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { READONLY_CLICK_EVENT_NAME } from '@/pages/Prototype/components/ReadOnlyBadge';
import { useEditingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';

import { Container, Lifecycle, NodeBlock, NodeStartBlock, Styles } from './components';

const Node: React.FC = () => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const isEditingMode = useEditingMode();
  const isPrototypingMode = usePrototypingMode();

  const contextMenu = React.useContext(ContextMenuContext)!;
  const instance = useNodeInstance<HTMLDivElement>();
  const { isFocused } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
  }));
  const shouldRender = nodeEntity.nodeType !== BlockType.COMMAND;
  const { onMouseDown, onClick, onDragStart } = useNodeDrag();

  const onRightClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (nodeEntity.nodeType !== BlockType.START && isEditingMode) {
        contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeEntity.nodeID);
      }
    },
    [isEditingMode]
  );

  const onClickHandler = (e: React.MouseEvent) => {
    onClick(e);
    if (isPrototypingMode) {
      const event = new Event(READONLY_CLICK_EVENT_NAME);
      window.dispatchEvent(event);
    }
  };
  const onDoubleClick = React.useCallback(() => {
    if (engine.comment.isActive) return;

    engine.node.center(nodeEntity.nodeID);
  }, []);

  nodeEntity.useInstance(instance);

  useSetup(() => {
    if (isFocused) {
      instance.ref.current?.focus();
    }
  });

  if (!shouldRender) {
    return null;
  }

  let nodeEl: JSX.Element | null = null;

  if (nodeEntity.nodeType === BlockType.COMMENT) {
    nodeEl = <CommentBlock ref={instance.blockRef} />;
  } else if (nodeEntity.nodeType === BlockType.COMBINED) {
    nodeEl = <NodeBlock ref={instance.blockRef} />;
  } else if (nodeEntity.nodeType === BlockType.START) {
    nodeEl = <NodeStartBlock ref={instance.blockRef} />;
  }

  return (
    <>
      <Styles />
      <Lifecycle />
      <Container
        draggable
        className={ClassName.CANVAS_NODE}
        data-node-id={nodeEntity.nodeID}
        position={instance.getPosition()}
        isTransform={!isPresentationMode}
        onMouseDown={onMouseDown}
        onDragStart={onDragStart}
        onClick={onClickHandler}
        onContextMenu={onRightClick}
        onDoubleClick={onDoubleClick}
        ref={instance.ref}
        tabIndex={-1}
      >
        {nodeEl}
      </Container>
    </>
  );
};

export default React.memo(Node);
