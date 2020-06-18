import cn from 'classnames';
import _noop from 'lodash/noop';
import React from 'react';

import { BlockType, FEATURE_IDS } from '@/constants';
import { usePermissions } from '@/contexts';
import { Markup } from '@/models';
import DraggingNode from '@/pages/Canvas/components/DraggingNode';
import { CANVAS_MARKUP_CREATING_CLASSNAME, CANVAS_MARKUP_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useNodeDrag } from '@/pages/Canvas/hooks';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { ClassName } from '@/styles/constants';

import { Container, NodeStyles } from './components';
import { useMarkupInstance } from './hooks';
import { ResizableMarkupNodeData } from './types';

const MarkupNode = () => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const instance = useMarkupInstance<HTMLDivElement>();
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupModeContext);
  const [canUseMarkup] = usePermissions(FEATURE_IDS.MARKUP);

  const { node, data } = nodeEntity.useState((e) => {
    const resolved = e.resolve<Markup.AnyNodeData>();

    return {
      node: resolved.node,
      data: resolved.data,
    };
  });

  const doubleClickHandler = () => {
    if (canUseMarkup && !markup?.isOpen) {
      markup?.openTool();
      engine.setActive(node.id);
    }
  };

  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType)!;

  // for optimization reason using query selector to filter click events if markup is not opened
  const skipClick = React.useCallback(() => !document.getElementsByClassName(CANVAS_MARKUP_ENABLED_CLASSNAME).length, []);
  const skipDrag = React.useCallback(() => !!document.getElementsByClassName(CANVAS_MARKUP_CREATING_CLASSNAME).length, []);

  const { onClick, onMouseDown, onDragStart } = useNodeDrag({ skipClick, skipDrag });

  // TODO: implement context menu
  const onRightClick = React.useCallback(_noop, []);

  nodeEntity.useInstance(instance);

  return (
    <>
      <NodeStyles />

      <DraggingNode
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
            isShape={nodeEntity.nodeType === BlockType.MARKUP_SHAPE}
            isText={nodeEntity.nodeType === BlockType.MARKUP_TEXT}
            rotate={(data as ResizableMarkupNodeData).rotate || 0}
            scale={(data as Markup.NodeData.Text).scale ?? 1}
            maxWidth={(data as Markup.NodeData.Text).width ?? null}
            ref={instance.transformRef}
          >
            <NodeComponent node={node} data={data as any} />
          </Container>
        )}
      </DraggingNode>
    </>
  );
};

export default React.memo(MarkupNode);
