import cn from 'classnames';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import Canvas from '@/components/Canvas';
import { FeatureFlag } from '@/config/features';
import { DragItem, HOVER_THROTTLE_TIMEOUT, MARKUP_SHAPES, MarkupModeType, MarkupShapeType } from '@/constants';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import MergeLayer from '@/pages/Canvas/components/MergeLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import SelectionMarquee from '@/pages/Canvas/components/SelectionMarquee';
import TransformOverlay from '@/pages/Canvas/components/TransformOverlay';
import { CANVAS_COMMENTING_ENABLED } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { activeDiagramViewportSelector } from '@/store/selectors';
import { Viewport } from '@/types';
import { Coords } from '@/utils/geometry';

import ThreadLayer from '../ThreadLayer';
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
  const markup = useFeature(FeatureFlag.MARKUP);
  const commenting = useFeature(FeatureFlag.COMMENTING);
  const engine = React.useContext(EngineContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;

  const contextMenu = React.useContext(ContextMenuContext)!;
  const { canEdit } = React.useContext(EditPermissionContext)!;
  const { modeType: markupModeType, isCreating: isMarkupCreating, finishCreating: finishMarkupCreating } = React.useContext(MarkupModeContext)!;

  const isCommentingMode = useCommentingMode();
  const { panViewport, zoomViewport, updateViewport } = useCursorControls();

  const onDragStart = React.useCallback(
    (event: React.DragEvent) => {
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

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.defaultPrevented || event.button === 2) return;

      if (isCommentingMode && !engine.comment.hasTarget) {
        if (engine.comment.isCreating) {
          engine.comment.reset();
        } else {
          focusThread.resetFocus();
          engine.comment.startThread();
        }
      }
    },
    [isCommentingMode]
  );

  const onClickCanvas = React.useCallback(
    async (event: React.MouseEvent) => {
      if (event.defaultPrevented) return;

      if (isMarkupCreating && !MARKUP_SHAPES.includes(markupModeType as MarkupShapeType)) {
        if (markupModeType === MarkupModeType.TEXT) {
          await engine.markup.addTextNode();
        }

        finishMarkupCreating();
      }
    },
    [isCommentingMode, isMarkupCreating, markupModeType]
  );

  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  const startGroupSelection = React.useCallback<React.MouseEventHandler>(
    (event) => canEdit && engine.groupSelection.start([event.clientX, event.clientY]),
    [canEdit]
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

  return (
    <>
      <Canvas
        viewport={viewport}
        onClick={onClickCanvas}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onChange={updateViewport}
        onPan={panViewport}
        onZoom={zoomViewport}
        onRegister={registerCanvas}
        onRightClick={contextMenu.onOpen}
        onShiftDragStart={startGroupSelection}
        innerRef={connectBlockDrop}
        onDragStart={onDragStart}
        className={cn({ [CANVAS_COMMENTING_ENABLED]: isCommentingMode })}
      >
        <LinkLayer />
        <NodeLayer />
        {markup.isEnabled && <MarkupLayer />}
        {commenting.isEnabled && <ThreadLayer />}
        <MergeLayer />
        <SelectionMarquee />
      </Canvas>
      <TransformOverlay />
    </>
  );
};

export default withInitialViewport(CanvasDiagram);
