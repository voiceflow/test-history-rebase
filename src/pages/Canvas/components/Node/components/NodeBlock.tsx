import _throttle from 'lodash/throttle';
import moize from 'moize';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { BlockState, BlockVariant } from '@/constants/canvas';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useEnableDisable, useHover } from '@/hooks';
import Block, { BlockAPI, HEADER_HEIGHT } from '@/pages/Canvas/components/Block';
import { REORDER_INDICATOR_CLASSNAME } from '@/pages/Canvas/components/Step/constants';
import { EngineContext, NodeIDProvider, NodeInjectedProps, useNodeData, withNode } from '@/pages/Canvas/contexts';
import { ConnectedProps, MergeArguments } from '@/types';
import { buildVirtualDOMRect } from '@/utils/dom';
import { compose } from '@/utils/functional';

import NodePort from './NodePort';
import NodeStep from './NodeStep';
import ReorderIndicator from './ReorderIndicator';
import SourceReorderIndicator from './SourceReorderIndicator';
import TerminalReorderIndicator from './TerminalReorderIndicator';

export type NodeBlockProps = {
  isFocused: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  canModify: boolean;
  newSourceNodeIndex: null | number;
};

const getBlockState = (props: NodeBlockProps, { isHovered, hasLinkWarning }: { isHovered: boolean; hasLinkWarning: boolean }) => {
  if (isHovered && hasLinkWarning) return BlockState.DISABLED;

  if (props.isFocused) return BlockState.ACTIVE;

  if (props.isSelected) return BlockState.SELECTED;

  if (props.isHighlighted || isHovered) return BlockState.HOVERED;

  return BlockState.REGULAR;
};

const NodeBlock = (
  { nodeID, node, lockOwner, linkIDs, ...props }: NodeInjectedProps & NodeBlockProps & ConnectedNodeProps,
  ref: React.RefObject<{ api: BlockAPI }>
) => {
  const isTransitioning = React.useRef(false);
  const { data } = useNodeData();

  const engine = React.useContext(EngineContext)!;
  const [inPortID] = node.ports.in;
  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = ref.current!.api.getBoundingClientRect();

    // account for the correct spacing for the header
    return buildVirtualDOMRect([x, y + 4 * engine.canvas!.getZoom()]);
  }, []);
  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const hasNestedInPort = engine.getNodeByID(node.combinedNodes[0])?.ports.in.length !== 0;
  const [isHovered, wrapElement, hoverHandlers, setHovering] = useHover(
    {
      onStart: () => {
        const isPinned = engine.linkCreation.hasPin;

        if (
          engine.linkCreation.isDrawing &&
          !engine.linkCreation.containsSourcePort(nodeID) &&
          !engine.linkCreation.isSourceNode(node.combinedNodes[0])
        ) {
          if (!hasNestedInPort) {
            setLinkWarning();

            if (isPinned) {
              engine.linkCreation.unpin();
            }

            return true;
          }

          const { x, y } = getAnchorPoint();

          engine.linkCreation.pin(inPortID, engine.canvas!.transformPoint([x, y + (HEADER_HEIGHT / 2) * engine.canvas!.getZoom()]));

          return true;
        }

        if (isPinned) {
          engine.linkCreation.unpin();
        }

        return false;
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

  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);
  const updateBlockColor = React.useCallback((blockColor) => engine.node.updateData(nodeID, { blockColor }), [engine, nodeID]);
  const variant = data.blockColor || BlockVariant.STANDARD;

  const onInsert = React.useMemo(
    () =>
      moize((index: number) => async (event: React.MouseEvent) => {
        if (engine.drag.hasTarget) {
          const target = engine.drag.target!;

          event.preventDefault();

          await Promise.all([engine.node.insertNested(nodeID, index, target), engine.drag.reset()]);
        }
      }),
    [nodeID]
  );

  React.useEffect(() => {
    let redrawTimer: number | null = null;
    const isTarget = (event: TransitionEvent) =>
      event.propertyName === 'height' && (event.target! as HTMLElement).classList.contains(REORDER_INDICATOR_CLASSNAME);
    const onTransitionStart = (event: TransitionEvent) => {
      if (isTarget(event)) {
        isTransitioning.current = true;
        clearInterval(redrawTimer!);
        redrawTimer = setInterval(() => {
          if (!isTransitioning.current) {
            clearInterval(redrawTimer!);
          }

          engine.node.redrawNestedLinks(nodeID);
        }, 1);
      }
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (isTransitioning.current) {
        clearInterval(redrawTimer!);
        isTransitioning.current = false;
      }

      if (isTarget(event)) {
        engine.node.redrawNestedLinks(nodeID);
      }
    };

    const rootEl = ref.current?.api.ref.current!;

    rootEl.addEventListener('transitionstart', onTransitionStart);
    rootEl.addEventListener('transitionend', onTransitionEnd);
    rootEl.addEventListener('transitioncancel', onTransitionEnd);

    return () => {
      rootEl.removeEventListener('transitionstart', onTransitionStart);
      rootEl.removeEventListener('transitionend', onTransitionEnd);
      rootEl.removeEventListener('transitioncancel', onTransitionEnd);
    };
  }, []);

  React.useEffect(() => {
    if (isHovered && (!engine.linkCreation.activeTargetPortID || engine.linkCreation.isCompleting)) {
      setHovering(false);
    }
  }, [linkIDs]);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(nodeID);
  }, [props.canModify]);

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,
    hover: _throttle(
      (_, monitor) => {
        if (!monitor.isOver({ shallow: true })) {
          return;
        }

        engine.merge.clearTargetStep();
        engine.merge.setTarget(nodeID);
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),
  });

  return (
    <>
      {inPortID && !hasLinkWarning && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      {wrapElement(
        <Block
          name={data.name}
          state={getBlockState(props, { isHovered, hasLinkWarning })}
          variant={variant}
          updateName={updateName}
          updateBlockColor={updateBlockColor}
          lockOwner={lockOwner}
          ref={(api) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ref.current = api;

            connectBlockDrop(ref.current?.api.ref.current!);
          }}
          canEditTitle
          hasLinkWarning={hasLinkWarning}
          {...hoverHandlers}
        >
          {node.combinedNodes.map((stepNodeID, index) => (
            <NodeIDProvider value={stepNodeID} key={stepNodeID}>
              {index === 0 && <SourceReorderIndicator isEnabled={props.canModify} index={0} onMouseUp={onInsert(0)} variant={variant} />}
              <NodeStep isDraggable isLast={index === node.combinedNodes.length - 1} variant={variant} />
              {index === node.combinedNodes.length - 1 ? (
                <TerminalReorderIndicator isEnabled={props.canModify} index={index + 1} onMouseUp={onInsert(index + 1)} variant={variant} />
              ) : (
                <ReorderIndicator isEnabled={props.canModify} index={index + 1} onMouseUp={onInsert(index + 1)} variant={variant} />
              )}
            </NodeIDProvider>
          ))}
        </Block>
      )}
    </>
  );
};

const mapStateToProps = {
  linkIDs: Creator.linkIDsByPortIDSelector,
};

const mergeProps = (...[{ linkIDs: getLinkIDs }, , { node }]: MergeArguments<typeof mapStateToProps, {}, NodeInjectedProps>) => ({
  linkIDs: getLinkIDs(node.ports.in[0]),
});

type ConnectedNodeProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(
  withNode,
  connect(mapStateToProps, null, mergeProps, { forwardRef: true }),
  React.memo,
  React.forwardRef
)(NodeBlock) as React.ForwardRefExoticComponent<NodeBlockProps & React.RefAttributes<{ api: BlockAPI }>>;
