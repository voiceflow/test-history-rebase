import cn from 'classnames';
import _noop from 'lodash/noop';
import React from 'react';

import { Permission } from '@/config/permissions';
import { BlockType } from '@/constants';
import { usePermission } from '@/hooks';
import { Markup } from '@/models';
import NodeDragTarget from '@/pages/Canvas/components/Node/components/NodeDragTarget';
import { useNodeDrag } from '@/pages/Canvas/components/Node/hooks';
import { CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { Border, Container, NodeStyles } from './components';
import { useMarkupInstance } from './hooks';
import { ResizableMarkupNodeData } from './types';

const MarkupNode = () => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const instance = useMarkupInstance<HTMLDivElement>();
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const [canUseMarkup] = usePermission(Permission.CANVAS_MARKUP);

  const { node, data } = nodeEntity.useState((e) => {
    const resolved = e.resolve<Markup.AnyNodeData>();

    return {
      node: resolved.node,
      data: resolved.data,
    };
  });

  const doubleClickHandler = () => {
    if (canUseMarkup && !engine.markup.isActive) {
      engine.markup.activate();
      engine.setActive(node.id);
    }
  };

  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType)!;

  const skipClick = React.useCallback(() => !engine.markup.isActive, []);

  // for optimization reason using query selector to filter click events if markup is not opened
  const skipDrag = React.useCallback(() => !!document.getElementsByClassName(CANVAS_MARKUP_CREATING_CLASSNAME).length, []);

  const { onClick, onMouseDown, onDragStart } = useNodeDrag({ skipClick, skipDrag });

  // TODO: implement context menu
  const onRightClick = React.useCallback(_noop, []);

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
            scale={(data as Markup.NodeData.Text).scale ?? 1}
            maxWidth={(data as Markup.NodeData.Text).overrideWidth ?? null}
            ref={instance.transformRef}
          >
            <NodeComponent ref={instance.blockRef} node={node} data={data as any} />

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
