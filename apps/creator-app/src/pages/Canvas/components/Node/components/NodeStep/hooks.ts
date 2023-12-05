import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useEnableDisable, useHover } from '@/hooks';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { StepAPI } from '@/pages/Canvas/types';
import { useEditingMode, useInteractiveMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';
import { Coords } from '@/utils/geometry';

export interface InternalNodeInstance extends NodeInstance {
  ref: React.RefObject<HTMLElement>;
}

export interface InternalStepAPI<T extends HTMLElement = HTMLElement> extends StepAPI<T> {
  isHovered: boolean;
  setHovering: (hovering: boolean) => void;
  hasLinkWarning: boolean;
}

export const useNodeInstance = () => {
  const ref = React.useRef<HTMLElement>(null);
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const elementInstance = useElementInstance(ref);

  const getRect = React.useCallback(() => ref.current?.getBoundingClientRect() || null, []);

  return React.useMemo<InternalNodeInstance>(
    () => ({
      ...elementInstance,

      ref,
      rename: () => engine.setActive(nodeEntity.nodeID),
      getRect,
      getThreadAnchorCoords: () => {
        const rect = getRect();

        return rect && new Coords([rect.x, rect.y]).onPlane(engine.canvas!.getPlane());
      },
      getPosition: () => [0, 0],
      getCenterPoint: () => {
        const rect = getRect();

        if (!engine.canvas || !rect) return null;

        return engine.canvas.transformPoint([rect.x + rect.width / 2, rect.y + rect.height / 2], { relative: true, bounding: true });
      },
    }),
    [elementInstance]
  );
};

export const useStepAPI = <T extends HTMLElement>(
  stepRef: React.RefObject<T>,
  withPorts: boolean,
  isDraggable: boolean,
  getAnchorPoint: () => DOMRect | null
) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;

  const { lockOwner } = nodeEntity.useState((e) => ({
    lockOwner: e.lockOwner,
  }));

  const isEditingMode = useEditingMode();
  const isInteractiveMode = useInteractiveMode();
  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const [isHovered, wrapElement, hoverHandlers, setHovering] = useHover(
    {
      onStart: (event) => {
        // preventing actions from being hovered
        if ((event?.target as HTMLElement)?.closest(`.${ClassName.CANVAS_NODE}--${BlockType.ACTIONS}`)) return false;

        if (!engine.linkCreation.canTargetNode(nodeEntity.nodeID)) return false;

        if (!nodeEntity.inPortID) {
          setLinkWarning();
          return true;
        }

        const rect = getAnchorPoint();

        if (!rect || !engine.canvas) return false;

        engine.linkCreation.pin(nodeEntity.inPortID, rect);

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
        onClick: (event: React.MouseEvent) => {
          if (event.shiftKey) return;

          event.preventDefault();
          engine.setActive(nodeEntity.nodeID);
        },
        onDoubleClick: stopPropagation(() => engine.node.center(nodeEntity.nodeID)),
        onContextMenu: stopPropagation((event: React.MouseEvent) => {
          if (nodeEntity.nodeType === BlockType.START || isInteractiveMode) return;

          contextMenu.onOpen(event, ContextMenuTarget.NODE, nodeEntity.nodeID);
        }),
        onMouseUp: (event: React.MouseEvent) => {
          if (event.shiftKey || event.ctrlKey || event.button === 1 || engine.groupSelection.isDrawing) return;

          event.preventDefault();

          if (nodeEntity.inPortID && engine.linkCreation.canTargetNode(nodeEntity.nodeID)) {
            engine.linkCreation.complete(nodeEntity.inPortID);
          } else {
            engine.clearActivation({ skipUrlSync: true });
          }
        },
        onDragStart: async (dragEvent: React.DragEvent) => {
          if (!isEditingMode) return;

          dragEvent.preventDefault();

          const handleMouseUp = async (event: MouseEvent) => {
            await Promise.all([event.defaultPrevented ? Promise.resolve() : engine.merge.unmerge(), engine.drag.reset()]);
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
