import composeRefs from '@seznam/compose-react-refs';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { compose } from '@/hocs';
import { useEnableDisable, useHover } from '@/hooks';
import Block, { HEADER_HEIGHT } from '@/pages/Canvas/components/Block';
import { NODE_DISABLED_CLASSNAME, NODE_HOVERED_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, NodeEntityContext, NodeEntityProvider, PortEntityProvider } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';
import { buildVirtualDOMRect } from '@/utils/dom';

import NodePort from '../NodePort';
import NodeStep from '../NodeStep';
import { ReorderIndicator, SourceReorderIndicator, Styles, TerminalReorderIndicator } from './components';

const NodeBlock: React.ForwardRefRenderFunction<BlockAPI> = (_, ref) => {
  const blockRef = React.useRef<BlockAPI>(null);
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { name, variant, combinedNodes, lockOwner, isMergeTarget } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve();

    return {
      name: data.name,
      variant: data.blockColor || BlockVariant.STANDARD,
      combinedNodes: node.combinedNodes,
      isMergeTarget: e.isMergeTarget,
      lockOwner: e.lockOwner,
    };
  });
  const observer = React.useMemo(() => new ResizeObserver(() => engine.node.redrawLinks(nodeEntity.nodeID)), []);

  const getAnchorPoint = React.useCallback(() => {
    const rect = blockRef.current!.getRect();

    // account for the correct spacing for the header
    return rect && buildVirtualDOMRect([rect.x, rect.y + 4 * engine.canvas!.getZoom()]);
  }, []);

  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const hasNestedInPort = engine.getNodeByID(combinedNodes[0])?.ports.in.length !== 0;

  const [isHovered, wrapElement, hoverHandlers] = useHover(
    {
      onStart: () => {
        const isPinned = engine.linkCreation.hasPin;

        if (
          engine.linkCreation.isDrawing &&
          !engine.linkCreation.containsSourcePort(nodeEntity.nodeID) &&
          !engine.linkCreation.isSourceNode(combinedNodes[0])
        ) {
          if (!hasNestedInPort) {
            setLinkWarning();

            if (isPinned) {
              engine.linkCreation.unpin();
            }

            return true;
          }

          const anchorPoint = getAnchorPoint();

          if (!anchorPoint || !nodeEntity.inPortID) {
            return false;
          }

          engine.linkCreation.pin(
            nodeEntity.inPortID,
            engine.canvas!.transformPoint([anchorPoint.x, anchorPoint.y + (HEADER_HEIGHT / 2) * engine.canvas!.getZoom()])
          );

          return true;
        }

        if (isPinned) {
          engine.linkCreation.unpin();
        }

        return false;
      },
      onMove: () => {
        return engine.linkCreation.isDrawing;
      },
      onEnd: () => {
        if (!hasNestedInPort) {
          clearLinkWarning();
          return;
        }

        engine.linkCreation.unpin();
      },
      cleanupOnOverride: false,
    },
    [hasNestedInPort]
  );

  const updateName = React.useCallback((name) => engine.node.updateData(nodeEntity.nodeID, { name }), [engine, nodeEntity.nodeID]);

  const onInsert = React.useMemo(
    () =>
      moize((index: number) => async (event: React.MouseEvent) => {
        if (engine.drag.hasTarget) {
          const target = engine.drag.target!;

          event.preventDefault();

          await Promise.all([engine.node.insertNested(nodeEntity.nodeID, index, target), engine.drag.reset()]);
        }
      }),
    [nodeEntity.nodeID]
  );

  React.useEffect(() => {
    engine.node.redrawNestedLinks(nodeEntity.nodeID);
  }, [isMergeTarget]);

  React.useEffect(() => {
    const blockEl = blockRef.current!.ref.current!;

    observer.observe(blockEl);

    return () => observer.unobserve(blockEl);
  }, []);

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,
    hover: _throttle(
      (_, monitor) => {
        if (!monitor.isOver({ shallow: true })) {
          return;
        }

        engine.merge.clearTargetStep();
        engine.merge.setTarget(nodeEntity.nodeID);
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),
  });

  const captureDropRef = React.useCallback((api: BlockAPI | null) => api && connectBlockDrop(api.ref.current!), [connectBlockDrop]);

  const isDisabled = isHovered && hasLinkWarning;
  nodeEntity.useConditionalStyle(NODE_HOVERED_CLASSNAME, isHovered);
  nodeEntity.useConditionalStyle(NODE_DISABLED_CLASSNAME, isDisabled);

  return (
    <>
      <Styles isHovered={isHovered} hasLinkWarning={hasLinkWarning} />
      {nodeEntity.inPortID && !hasLinkWarning && (
        <PortEntityProvider id={nodeEntity.inPortID}>
          <NodePort getAnchorPoint={getAnchorPoint} />
        </PortEntityProvider>
      )}
      {wrapElement(
        <Block
          name={name}
          isDisabled={isDisabled}
          isLocked={nodeEntity.isLocked}
          variant={variant}
          updateName={updateName}
          lockOwner={lockOwner}
          ref={composeRefs(ref, blockRef, captureDropRef)}
          canEditTitle
          {...hoverHandlers}
        >
          {combinedNodes.map((stepNodeID, index) => (
            <NodeEntityProvider id={stepNodeID} key={stepNodeID}>
              {index === 0 && <SourceReorderIndicator isEnabled={isMergeTarget} index={0} onMouseUp={onInsert(0)} variant={variant} />}
              <NodeStep isDraggable isLast={index === combinedNodes.length - 1} variant={variant} />
              {index === combinedNodes.length - 1 ? (
                <TerminalReorderIndicator isEnabled={isMergeTarget} index={index + 1} onMouseUp={onInsert(index + 1)} variant={variant} />
              ) : (
                <ReorderIndicator isEnabled={isMergeTarget} index={index + 1} onMouseUp={onInsert(index + 1)} variant={variant} />
              )}
            </NodeEntityProvider>
          ))}
        </Block>
      )}
    </>
  );
};

export default compose(React.memo, React.forwardRef)(NodeBlock);
