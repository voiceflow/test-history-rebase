import cuid from 'cuid';
import _constant from 'lodash/constant';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';
import { ThemeContext } from 'styled-components';

import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { useEnableDisable, useHover, useTeardown } from '@/hooks';
import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EditPermissionContext, EngineContext, ManagerContext, useNode } from '@/pages/Canvas/contexts';
import { NodeAPI, PortAPI, StepAPI } from '@/pages/Canvas/types';
import { buildVirtualDOMRect, stopPropagation } from '@/utils/dom';
import { isInRange } from '@/utils/number';

export const useNodeLifecycle = () => {
  const { nodeID, node } = useNode();
  const engine = React.useContext(EngineContext)!;
  const nodeCache = React.useRef(node);

  nodeCache.current = node || nodeCache.current;

  // redraw links when rendering
  React.useEffect(() => {
    if (node) {
      engine.node.redrawLinks(nodeID);
    }
  }, [!!node]);

  // update origin when changing position
  React.useEffect(() => {
    if (node) {
      engine.node.setOrigin(nodeID, [node.x, node.y]);
    }
  }, [node?.x, node?.y]);

  // redraw links in parent block when unmounting
  React.useEffect(
    () => () => {
      const { parentNode } = nodeCache.current;

      if (parentNode) {
        engine.node.redrawNestedLinks(parentNode);
      }
    },
    []
  );
};

export const useStepAPI = <T extends HTMLElement>(
  isForceHighlighted: boolean,
  withPorts: boolean,
  isDraggable: boolean,
  stepRef: React.RefObject<T>
) => {
  const { nodeID, node, isHighlighted, lockOwner } = useNode();
  const editPermission = React.useContext(EditPermissionContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;
  const engine = React.useContext(EngineContext)!;
  const theme = React.useContext(ThemeContext);
  const [inPortID] = node?.ports?.in || [];
  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const [isHovered, wrapElement, hoverHandlers, setHovering] = useHover(
    {
      onStart: () => {
        if (engine.linkCreation.isDrawing && !engine.linkCreation.isSourceNode(nodeID)) {
          if (!inPortID) {
            setLinkWarning();
            return true;
          }

          const { top, left } = stepRef.current!.getBoundingClientRect();
          const zoom = engine.canvas!.getZoom();
          const pinPoint = engine.canvas!.transformPoint([left - LINK_WIDTH * zoom, top + (theme.components.blockStep.minHeight / 2) * zoom]);

          engine.linkCreation.pin(inPortID, pinPoint);

          return true;
        }

        return false;
      },
      onEnd: () => {
        if (!inPortID) {
          clearLinkWarning();
          return;
        }

        engine.linkCreation.unpin();
      },
      cleanupOnOverride: !inPortID,
    },
    []
  );
  const isActive = isForceHighlighted || isHighlighted;

  return React.useMemo<StepAPI<T>>(
    () => ({
      ref: stepRef,
      lockOwner,
      withPorts,
      hasLinkWarning,
      setHovering,
      isActive,
      isDraggable,
      isHovered,
      wrapElement,
      handlers: {
        onClick: () => {
          if (!engine.linkCreation.isDrawing) {
            engine.setActivation(nodeID);
          }
        },
        onDoubleClick: stopPropagation(() => engine.node.center(nodeID)),
        onContextMenu: stopPropagation((event: React.MouseEvent) => {
          if (node.type !== BlockType.START && editPermission.canEdit) {
            contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeID);
          }
        }),
        onMouseUp: (event: React.MouseEvent) => {
          if (engine.linkCreation.isDrawing && !engine.linkCreation.isSourceNode(nodeID)) {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
            engine.linkCreation.complete(node.ports.in[0]);
          }
        },
        onDragStart: async () => {
          if (!editPermission.canEdit) {
            return;
          }

          const handleMouseUp = async (event: MouseEvent) => {
            if (!event.defaultPrevented) {
              await engine.merge.unmerge();
            }

            await engine.drag.reset();
          };

          document.addEventListener('mouseup', handleMouseUp, { once: true });

          await engine.drag.set(nodeID);
        },
        ...hoverHandlers,
      },
    }),
    [lockOwner, withPorts, isDraggable, hasLinkWarning, isActive, isHovered, editPermission.canEdit, wrapElement, hoverHandlers]
  );
};

export const useNodeAPI = <T extends HTMLElement>(nodeID: string, ref: React.RefObject<T>) => {
  const instanceID = React.useMemo(() => cuid(), []);
  const [isHighlighted, setHighlight, clearHighlight] = useEnableDisable();
  const [isDragging, drag, drop] = useEnableDisable();
  const engine = React.useContext(EngineContext)!;

  return React.useMemo<Required<NodeAPI<T>>>(
    () => ({
      instanceID,
      isHighlighted,
      isDragging,
      ref,
      getPosition: () => {
        const rect = ref.current!.getBoundingClientRect();

        return engine.canvas!.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2]);
      },
      rename: () => engine.focus.set(nodeID, { renameActiveRevision: cuid() }),
      setHighlight,
      clearHighlight,
      drag,
      drop,
    }),
    [isHighlighted, isDragging]
  );
};

export const usePortAPI = (getAnchorPoint: () => DOMRect) => {
  const instanceID = React.useMemo(() => cuid(), []);

  return React.useMemo<PortAPI>(
    () => ({
      instanceID,
      isReady: _constant(true),
      getRect: () => {
        const { top, left } = getAnchorPoint();
        return buildVirtualDOMRect([left, top]);
      },
    }),
    []
  );
};

export const useNodeSubscription = (nodeID: string, api: NodeAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => engine.registerNode(nodeID, api), [api]);

  useTeardown(() => engine.expireNode(nodeID, api.instanceID));
};

export const useMergeInfo = (index: number) => {
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const { node } = useNode();

  if (!node || !engine.merge.hasSource) {
    return {
      mustNotBe: true,
    };
  }

  if (engine.merge.virtualSource) {
    const { type } = engine.merge.virtualSource;

    return {
      mustBeFirst: type === BlockType.INTENT,
      mustBeLast: getManager(type)?.mergeTerminator,
    };
  }

  const mergeSource = engine.getNodeByID(engine.merge.sourceNodeID!);

  if (!mergeSource) {
    return {
      mustNotBe: true,
    };
  }

  if (mergeSource.parentNode) {
    const parentNode = engine.getNodeByID(mergeSource.parentNode);
    const sourceIndex = parentNode.combinedNodes.indexOf(mergeSource.id);

    return {
      mustNotBe: node.parentNode === mergeSource.parentNode && isInRange(index, sourceIndex, sourceIndex + 1),
      mustBeFirst: mergeSource.type === BlockType.INTENT,
      mustBeLast: getManager(mergeSource.type)?.mergeTerminator,
    };
  }

  const [firstChildNodeID] = mergeSource.combinedNodes;
  const firstChildNode = engine.getNodeByID(firstChildNodeID);
  const lastChildNodeID = mergeSource.combinedNodes[mergeSource.combinedNodes.length - 1];
  const lastChildNode = engine.getNodeByID(lastChildNodeID);

  return {
    mustBeFirst: firstChildNode?.type === BlockType.INTENT,
    mustBeLast: getManager(lastChildNode?.type)?.mergeTerminator,
  };
};

export const useDnDHoverReorderIndicator = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const isHoveredLocal = React.useRef(false);
  const [isHovered, setHovered] = React.useState(false);

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,

    hover: _throttle(
      () => {
        if (!isHoveredLocal.current) {
          engine.merge.setTargetStep(index, () => {
            isHoveredLocal.current = false;
            setHovered(false);
          });
        }

        isHoveredLocal.current = true;
        setHovered(true);
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),

    drop: (_, monitor) => {
      const newNodeID = cuid();
      const { type, factoryData } = engine.merge.virtualSource!;

      const { x: mouseX, y: mouseY } = monitor.getClientOffset()!;

      const position = engine.canvas!.transformPoint([mouseX, mouseY]);

      engine.node.addNestedV2({
        type,
        index,
        nodeID: newNodeID,
        position,
        factoryData,
        parentNodeID: engine.merge.targetNodeID!,
      });

      return { captured: true };
    },
  });

  return [connectBlockDrop, isHovered] as const;
};
