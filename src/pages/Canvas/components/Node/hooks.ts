import cuid from 'cuid';
import React from 'react';
import { ThemeContext } from 'styled-components';

import { BlockType } from '@/constants';
import { useEnableDisable, useHover, useTeardown } from '@/hooks';
import { LINK_WIDTH } from '@/pages/Canvas/components/PortV2/constants';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EditPermissionContext, EngineContext, ManagerContext, useNode } from '@/pages/Canvas/contexts';
import { NodeAPI, PortAPI, StepAPI } from '@/pages/Canvas/types';
import { buildVirtualDOMRect, stopPropagation } from '@/utils/dom';
import { isInRange } from '@/utils/number';

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
  const [isHovered, wrapElement, hoverHandlers] = useHover(
    {
      onStart: () => {
        if (engine.linkCreation.isDrawing && !engine.linkCreation.isSourceNode(nodeID)) {
          if (!inPortID) {
            setLinkWarning();
            return true;
          }

          const { top, left } = stepRef.current!.getBoundingClientRect();
          const pinPoint = engine.canvas.transformPoint([
            left - LINK_WIDTH * engine.canvas.getZoom(),
            top + (theme.components.blockStep.minHeight / 2) * engine.canvas.getZoom(),
          ]);

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
        onDoubleClick: () => engine.node.center(nodeID),
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
              await engine.mergeV2.unmerge();
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

        return engine.canvas.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2]);
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

  if (!node) {
    return {
      mustNotBe: true,
    };
  }

  if (engine.drag.hasTarget) {
    const dragTarget = engine.getNodeByID(engine.drag.target!);

    if (dragTarget.parentNode) {
      const parentNode = engine.getNodeByID(dragTarget.parentNode);
      const sourceIndex = parentNode.combinedNodes.indexOf(dragTarget.id);

      return {
        mustNotBe: node.parentNode === dragTarget.parentNode && isInRange(index, sourceIndex, sourceIndex + 1),
        mustBeFirst: dragTarget.type === BlockType.INTENT,
        mustBeLast: getManager(dragTarget.type)?.mergeTerminator,
      };
    }

    const [firstChildNodeID] = dragTarget.combinedNodes;
    const firstChildNode = engine.getNodeByID(firstChildNodeID);
    const lastChildNodeID = dragTarget.combinedNodes[dragTarget.combinedNodes.length - 1];
    const lastChildNode = engine.getNodeByID(lastChildNodeID);

    return {
      mustBeFirst: firstChildNode?.type === BlockType.INTENT,
      mustBeLast: getManager(lastChildNode?.type)?.mergeTerminator,
    };
  }

  return {
    mustBeFirst: false,
    mustBeLast: false,
  };
};
