import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import Canvas from '@/components/Canvas';
import { DragItem, HOVER_THROTTLE_TIMEOUT, MARKUP_SHAPES, MarkupModeType, MarkupShapeType } from '@/constants';
import { connect } from '@/hocs';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import MergeLayer from '@/pages/Canvas/components/MergeLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import SelectionMarquee from '@/pages/Canvas/components/SelectionMarquee';
import TransformOverlay from '@/pages/Canvas/components/TransformOverlay';
import { ContextMenuContext, EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode, useEditingMode } from '@/pages/Skill/hooks';
import { activeDiagramViewportSelector } from '@/store/selectors';
import { Viewport } from '@/types';
import { Coords } from '@/utils/geometry';

import { useCursorControls } from './hooks';

const withInitialViewport = connect({ viewport: activeDiagramViewportSelector }, null, null, {
  // ignore all further updates to the viewport
  // eslint-disable-next-line lodash/prefer-constant
  areStatesEqual: () => true,
});

type ConnectedCanvasDiagramProps = {
  viewport: Viewport;
};

const CanvasDiagram: React.FC<ConnectedCanvasDiagramProps> = ({ viewport }) => {
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;

  const contextMenu = React.useContext(ContextMenuContext)!;
  const { modeType: markupModeType, isCreating: isMarkupCreating, finishCreating: finishMarkupCreating } = React.useContext(MarkupModeContext)!;

  const isEditingMode = useEditingMode();
  const [draggedCanvas, setDraggedCanvas] = React.useState(false);
  const isCommentingMode = useCommentingMode();
  const { panViewport, zoomViewport, updateViewport } = useCursorControls();

  const onDragStart = React.useCallback(
    (event: React.DragEvent) => {
      setDraggedCanvas(true);
      if (isMarkupCreating && MARKUP_SHAPES.includes(markupModeType as MarkupShapeType)) {
        event.preventDefault();
        engine.clearActivation();

        engine.markup.createShapeNode();
      }
    },
    [isMarkupCreating, markupModeType]
  );

  const onMouseUp = React.useCallback((event: MouseEvent) => {
    if (event.defaultPrevented || engine.isCanvasBusy) return;

    engine.clearActivation();
  }, []);

  const onClickCanvas = React.useCallback(
    async (event: React.MouseEvent) => {
      if (event.defaultPrevented || draggedCanvas) {
        setDraggedCanvas(false);
        return;
      }

      if (isMarkupCreating && !MARKUP_SHAPES.includes(markupModeType as MarkupShapeType)) {
        if (markupModeType === MarkupModeType.TEXT) {
          await engine.markup.addTextNode();
        }

        finishMarkupCreating();
      }

      if (isCommentingMode && !engine.comment.hasTarget) {
        if (engine.comment.isCreating || engine.comment.hasFocus) {
          engine.comment.reset();
        } else {
          focusThread.resetFocus();
          engine.comment.startThread();
        }
      }
    },
    [isCommentingMode, isMarkupCreating, markupModeType, draggedCanvas]
  );

  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  const startGroupSelection = React.useCallback<React.MouseEventHandler>(
    (event) => isEditingMode && engine.groupSelection.start([event.clientX, event.clientY]),
    [isEditingMode]
  );

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,
    drop: async ({ clientOffset, blockType, factoryData }, monitor) => {
      if (monitor.didDrop() && monitor.getDropResult().captured) return;

      const { x: mouseX, y: mouseY } = monitor.getClientOffset() || clientOffset;

      await engine.node.add(blockType, new Coords([mouseX, mouseY]), factoryData);
    },
    hover: _throttle(
      (item, monitor) => {
        item.clientOffset = monitor.getClientOffset();

        if (!monitor.isOver({ shallow: true })) {
          return;
        }

        engine.merge.clearTarget();
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),
  });

  const addClass = React.useCallback((className: string) => engine.addClass(className), []);

  const removeClass = React.useCallback((className: string) => engine.removeClass(className), []);

  return (
    <>
      <Canvas
        viewport={viewport}
        onClick={onClickCanvas}
        onMouseUp={onMouseUp}
        onChange={updateViewport}
        onPan={panViewport}
        onZoom={zoomViewport}
        onRegister={registerCanvas}
        onRightClick={contextMenu.onOpen}
        onShiftDragStart={startGroupSelection}
        innerRef={connectBlockDrop}
        onDragStart={onDragStart}
        addClass={addClass}
        removeClass={removeClass}
      >
        <LinkLayer />
        <NodeLayer />
        <MarkupLayer />
        <MergeLayer />
        <SelectionMarquee />
      </Canvas>
      <TransformOverlay />
    </>
  );
};

export default withInitialViewport(CanvasDiagram);
