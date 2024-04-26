import type * as Realtime from '@voiceflow/realtime-sdk';
import { useColorPaletteWithDynamicSaturation } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import moize from 'moize';
import React from 'react';
import { useDrop } from 'react-dnd';

import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch, useEnableDisable, useHover } from '@/hooks';
import { NODE_DISABLED_CLASSNAME, NODE_HOVERED_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import type { CombinedAPI } from '@/pages/Canvas/types';
import { ClassName } from '@/styles/constants';

/**
 * used in NodeBlock and NodeChip components
 */
export const useCombined = ({ defaultBlockColor }: { defaultBlockColor: string }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const combinedRef = React.useRef<CombinedAPI>(null);

  const { name, blockColor, combinedNodes, isMergeTarget } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve<Realtime.NodeData.Combined>();

    return {
      name: data.name,
      blockColor: data.blockColor || defaultBlockColor,
      combinedNodes: node.combinedNodes,
      isMergeTarget: e.isMergeTarget,
    };
  });

  const palette = useColorPaletteWithDynamicSaturation(blockColor);

  const observer = React.useMemo(() => new ResizeObserver(() => engine.node.redrawLinks(nodeEntity.nodeID)), []);

  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();

  const getAnchorPoint = React.useCallback(() => combinedRef.current?.getRect() ?? null, []);

  const firstStepID = combinedNodes[0];
  const hasNestedInPort = engine.getNodeByID(firstStepID)?.ports.in.length !== 0;

  const [isHovered, wrapElement, hoverHandlers] = useHover(
    {
      onStart: (event) => {
        // preventing actions from being hovered
        if ((event?.target as HTMLElement)?.closest(`.${ClassName.CANVAS_NODE}--${BlockType.ACTIONS}`)) return false;

        const isPinned = engine.linkCreation.hasPin;

        if (
          engine.linkCreation.isDrawing &&
          !engine.linkCreation.containsSourcePort(nodeEntity.nodeID) &&
          !engine.linkCreation.isSourceNode(firstStepID)
        ) {
          if (!hasNestedInPort) {
            setLinkWarning();

            if (isPinned) {
              engine.linkCreation.unpin();
            }

            return true;
          }

          const anchorPoint = getAnchorPoint();

          if (!anchorPoint || !nodeEntity.inPortID) return false;

          engine.linkCreation.pin(nodeEntity.inPortID, anchorPoint);

          return true;
        }

        if (isPinned) {
          engine.linkCreation.unpin();
        }

        return false;
      },
      onMove: () => engine.linkCreation.isDrawing,
      onEnd: () => {
        if (!hasNestedInPort) {
          clearLinkWarning();
          return;
        }

        engine.linkCreation.unpin();
      },
      cleanupOnOverride: false,
    },
    [hasNestedInPort, firstStepID]
  );

  const onRename = React.useCallback(
    (name: string) => engine.node.updateData(nodeEntity.nodeID, { name }),
    [engine, nodeEntity.nodeID]
  );

  const onInsert = React.useMemo(
    () =>
      moize((index: number) => async (event: React.MouseEvent) => {
        if (engine.drag.hasTarget) {
          const target = engine.drag.target!;

          event.preventDefault();

          await Promise.all([engine.node.relocate(nodeEntity.nodeID, target, index), engine.drag.reset()]);
        }
      }),
    [nodeEntity.nodeID]
  );

  const [, connectBlockDrop] = useDrop({
    accept: [DragItem.BLOCK_MENU, DragItem.COMPONENTS, DragItem.LIBRARY],
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

  const onDropRef = React.useCallback(
    (api: CombinedAPI | null) => api?.ref.current && connectBlockDrop(api.ref.current),
    [connectBlockDrop]
  );

  const onClick = React.useCallback((event: React.MouseEvent) => {
    if (engine.prototype.isActive) {
      goToCurrentCanvas();
    }

    if (event.defaultPrevented || !engine.comment.isModeActive) {
      return;
    }

    if (engine.comment.isCreating) {
      engine.comment.resetCreating();
    } else {
      engine.comment.startThread();
    }

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  React.useEffect(() => onInsert.clear, [onInsert]);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(nodeEntity.nodeID);
  }, [isMergeTarget]);

  React.useEffect(() => {
    const nodeEl = combinedRef.current?.ref.current;

    if (!nodeEl) return undefined;

    observer.observe(nodeEl);

    return () => observer.unobserve(nodeEl);
  }, []);

  React.useEffect(
    () => () => {
      connectBlockDrop(null);
    },
    [connectBlockDrop]
  );

  const isDisabled = isHovered && hasLinkWarning;

  nodeEntity.useConditionalStyle(NODE_HOVERED_CLASSNAME, isHovered);
  nodeEntity.useConditionalStyle(NODE_DISABLED_CLASSNAME, isDisabled);

  return {
    name,
    palette,
    onClick,
    onRename,
    onInsert,
    onDropRef,
    isHovered,
    nodeEntity,
    isDisabled,
    wrapElement,
    combinedRef,
    combinedNodes,
    hoverHandlers,
    isMergeTarget,
    hasLinkWarning,
    getAnchorPoint,
  };
};
