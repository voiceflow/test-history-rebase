import * as Realtime from '@voiceflow/realtime-sdk';
import cn from 'classnames';
import React from 'react';

import { BlockType } from '@/constants';
import NodeDragTarget from '@/pages/Canvas/components/Node/components/NodeDragTarget';
import { useNodeDrag } from '@/pages/Canvas/components/Node/hooks';
import { CANVAS_MARKUP_CREATING_CLASSNAME, ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useEditingMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { Border, Container, NodeStyles } from './components';
import { useMarkupInstance } from './hooks';
import { ResizableMarkupNodeData } from './types';

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

  const doubleClickHandler = () => {
    engine.setActive(nodeEntity.nodeID);
  };

  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType)!;

  // for optimization reason using query selector to filter click events if markup is not opened
  const skipDrag = React.useCallback(() => !!document.getElementsByClassName(CANVAS_MARKUP_CREATING_CLASSNAME).length, []);

  const { onClick, onMouseDown, onDragStart } = useNodeDrag({ skipDrag });

  const onRightClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (isEditingMode) {
        contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeEntity.nodeID);
      }
    },
    [isEditingMode]
  );

  nodeEntity.useInstance(instance);

  return (
    <>
      <NodeStyles />

      <NodeDragTarget
        draggable
        className={cn(ClassName.CANVAS_NODE, `${ClassName.CANVAS_NODE}--${nodeEntity.nodeType}`)}
        position={instance.getPosition()}
        isTransform={!isPresentationMode}
        onMouseDown={onMouseDown}
        onDragStart={onDragStart}
        onClick={onClick}
        onContextMenu={onRightClick}
        ref={instance.ref}
        tabIndex={-1}
      >
        {NodeComponent && (
          <Container
            onDoubleClick={doubleClickHandler}
            isText={nodeEntity.nodeType === BlockType.MARKUP_TEXT}
            rotate={(data as ResizableMarkupNodeData).rotate || 0}
            scale={(data as Realtime.Markup.NodeData.Text).scale ?? 1}
            maxWidth={(data as Realtime.Markup.NodeData.Text).overrideWidth ?? null}
            backgroundColor={(data as Realtime.Markup.NodeData.Text).backgroundColor ?? null}
            ref={instance.transformRef}
          >
            <NodeComponent ref={instance.blockRef} data={data as any} />

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
