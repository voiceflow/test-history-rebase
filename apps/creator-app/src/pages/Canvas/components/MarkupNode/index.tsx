import * as Realtime from '@voiceflow/realtime-sdk';
import cn from 'classnames';
import React from 'react';

import NodeDragTarget from '@/pages/Canvas/components/Node/components/NodeDragTarget';
import { useNodeDrag } from '@/pages/Canvas/components/Node/hooks';
import { CANVAS_MARKUP_CREATING_CLASSNAME, ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useEditingMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { Border, Container, NodeStyles } from './components';
import { useMarkupInstance } from './hooks';

// for optimization reason using query selector to filter click events if markup is not opened
const skipDrag = () => !!document.getElementsByClassName(CANVAS_MARKUP_CREATING_CLASSNAME).length;

const MarkupNode = () => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);

  const instance = useMarkupInstance<HTMLDivElement>();
  const isEditingMode = useEditingMode();

  const { data } = nodeEntity.useState((e) => {
    const resolved = e.resolve<Realtime.Markup.AnyNodeData>();

    return {
      data: resolved.data,
    };
  });
  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType as Realtime.MarkupBlockType);

  const { onClick, onMouseDown, onDragStart } = useNodeDrag({ skipDrag });

  const onDoubleClick = () => {
    engine.setActive(nodeEntity.nodeID);
  };

  const onRightClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (isEditingMode) {
      contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeEntity.nodeID);
    }
  };

  nodeEntity.useInstance(instance);

  const isText = nodeEntity.nodeType === Realtime.BlockType.MARKUP_TEXT;

  return (
    <>
      <NodeStyles />

      <NodeDragTarget
        ref={instance.ref}
        onClick={onClick}
        position={instance.getPosition()}
        tabIndex={-1}
        draggable
        className={cn(ClassName.CANVAS_NODE, `${ClassName.CANVAS_NODE}--${nodeEntity.nodeType}`)}
        isTransform={!isPresentationMode}
        onMouseDown={onMouseDown}
        onDragStart={onDragStart}
        onContextMenu={onRightClick}
      >
        {NodeComponent && (
          <Container
            ref={instance.transformRef}
            isText={isText}
            maxWidth={(data as Realtime.Markup.NodeData.Text).overrideWidth ?? null}
            onDoubleClick={onDoubleClick}
            backgroundColor={(data as Realtime.Markup.NodeData.Text).backgroundColor ?? null}
          >
            <NodeComponent ref={instance.nodeRef} data={data as any} />

            <Border.Left />
            <Border.Right />
            <Border.Top />
            <Border.Bottom />
          </Container>
        )}
      </NodeDragTarget>
    </>
  );
};

export default React.memo(MarkupNode);
