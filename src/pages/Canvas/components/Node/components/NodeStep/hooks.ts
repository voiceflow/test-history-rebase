import cuid from 'cuid';
import React from 'react';
import { ThemeContext } from 'styled-components';

import { BlockType } from '@/constants';
import { useEnableDisable, useHover } from '@/hooks';
import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { StepAPI } from '@/pages/Canvas/types';
import { useEditingMode } from '@/pages/Skill/hooks';
import { preventDefault, stopPropagation } from '@/utils/dom';
import { Coords } from '@/utils/geometry';

export type InternalNodeInstance = NodeInstance & {
  ref: React.RefObject<HTMLElement>;
};

export type InternalStepAPI<T extends HTMLElement = HTMLElement> = StepAPI<T> & {
  isHovered: boolean;
  hasLinkWarning: boolean;
  setHovering: (hovering: boolean) => void;
};

export const useNodeInstance = () => {
  const ref = React.useRef<HTMLElement>(null);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const engine = React.useContext(EngineContext)!;
  const elementInstance = useElementInstance(ref);

  const getRect = React.useCallback(() => ref.current?.getBoundingClientRect() || null, []);

  return React.useMemo<InternalNodeInstance>(
    () => ({
      ...elementInstance,

      ref,
      rename: () => engine.focus.set(nodeEntity.nodeID, { renameActiveRevision: cuid() }),
      getRect,
      getThreadAnchorCoords: () => {
        const rect = getRect();

        return rect && new Coords([rect.x, rect.y]).onPlane(engine.canvas!.getPlane());
      },
      getPosition: () => [0, 0],
      getCenterPoint: () => {
        const rect = getRect();

        return rect && engine.canvas!.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2], { relative: true, bounding: true });
      },
    }),
    [elementInstance]
  );
};

export const useStepAPI = <T extends HTMLElement>(stepRef: React.RefObject<T>, withPorts: boolean, isDraggable: boolean) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { lockOwner } = nodeEntity.useState((e) => {
    return {
      lockOwner: e.lockOwner,
    };
  });
  const isEditingMode = useEditingMode();
  const contextMenu = React.useContext(ContextMenuContext)!;
  const engine = React.useContext(EngineContext)!;
  const theme = React.useContext(ThemeContext);
  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const [isHovered, wrapElement, hoverHandlers, setHovering] = useHover(
    {
      onStart: () => {
        if (!engine.linkCreation.canTargetNode(nodeEntity.nodeID)) {
          return false;
        }

        if (!nodeEntity.inPortID) {
          setLinkWarning();
          return true;
        }

        const { top, left } = stepRef.current!.getBoundingClientRect();
        const zoom = engine.canvas!.getZoom();
        const pinPoint = engine.canvas!.transformPoint([left - LINK_WIDTH * zoom, top + (theme.components.blockStep.minHeight / 2) * zoom]);

        engine.linkCreation.pin(nodeEntity.inPortID, pinPoint);

        return true;
      },
      onEnd: () => {
        if (!nodeEntity.inPortID) {
          clearLinkWarning();
          return;
        }

        engine.linkCreation.unpin();
      },
      cleanupOnOverride: !nodeEntity.inPortID,
    },
    []
  );

  return React.useMemo<InternalStepAPI<T>>(
    () => ({
      ref: stepRef,
      lockOwner,
      withPorts,
      setHovering,
      isDraggable,
      isHovered,
      hasLinkWarning,
      wrapElement,
      handlers: {
        onClick: preventDefault(() => engine.setActive(nodeEntity.nodeID)),
        onDoubleClick: stopPropagation(() => engine.node.center(nodeEntity.nodeID)),
        onContextMenu: stopPropagation((event: React.MouseEvent) => {
          if (nodeEntity.nodeType === BlockType.START || !isEditingMode) return;

          contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeEntity.nodeID);
        }),
        onMouseUp: (event: React.MouseEvent) => {
          if (!nodeEntity.inPortID || !engine.linkCreation.canTargetNode(nodeEntity.nodeID)) return;

          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          engine.linkCreation.complete(nodeEntity.inPortID);
        },
        onDragStart: async (dragEvent: React.DragEvent) => {
          if (!isEditingMode) return;

          dragEvent.preventDefault();

          const handleMouseUp = async (event: MouseEvent) => {
            if (!event.defaultPrevented) {
              await engine.merge.unmerge();
            }

            await engine.drag.reset();
          };

          document.addEventListener('mouseup', handleMouseUp, { once: true });

          await engine.drag.setTarget(nodeEntity.nodeID);
        },
        ...hoverHandlers,
      },
    }),
    [lockOwner, withPorts, isDraggable, isHovered, hasLinkWarning, isEditingMode, wrapElement, hoverHandlers]
  );
};
