import React from 'react';

import { BlockType } from '@/constants';
import { useSetup } from '@/hooks';
import { useNodeDrag, useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useCanvasMode, useEditingMode, usePrototypingMode } from '@/pages/Project/hooks';
import { READONLY_CLICK_EVENT_NAME } from '@/pages/Prototype/components/ReadOnlyBadge';
import { ClassName } from '@/styles/constants';

import { Container, Lifecycle, NodeChipStart, NodeCombined, Styles } from './components';

const Node: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const contextMenu = React.useContext(ContextMenuContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);
  const instance = useNodeInstance<HTMLDivElement>();
  const isEditingMode = useEditingMode();
  const isCanvasMode = useCanvasMode();

  const isPrototypingMode = usePrototypingMode();
  const { onClick, onMouseUp, onDragStart, onMouseDown } = useNodeDrag();

  const { isFocused } = nodeEntity.useState((e) => ({ isFocused: e.isFocused }));

  const shouldRender = nodeEntity.nodeType !== BlockType.COMMAND;

  const onRightClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (isCanvasMode) {
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
    if (engine.comment.isModeActive) return;

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

  if (nodeEntity.nodeType === BlockType.COMBINED) {
    nodeEl = <NodeCombined ref={instance.nodeRef} />;
  } else if (nodeEntity.nodeType === BlockType.START) {
    nodeEl = <NodeChipStart ref={instance.nodeRef} />;
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
        onMouseUp={onMouseUp}
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
