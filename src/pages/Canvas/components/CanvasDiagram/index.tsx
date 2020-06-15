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
import { ContextMenuContext, EngineContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { activeDiagramViewportSelector } from '@/store/selectors';
import { Viewport } from '@/types';

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
  const engine = React.useContext(EngineContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;
  const { canEdit } = React.useContext(EditPermissionContext)!;
  const { modeType: markupModeType, isCreating: isMarkupCreating, finishCreating: finishMarkupCreating } = React.useContext(MarkupModeContext)!;

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

  const onClickCanvas = React.useCallback(() => {
    if (!isMarkupCreating || MARKUP_SHAPES.includes(markupModeType as MarkupShapeType)) return;

    if (markupModeType === MarkupModeType.TEXT) {
      engine.markup.addTextNode();
    }

    finishMarkupCreating();
  }, [isMarkupCreating, markupModeType]);

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

      const position = engine.canvas!.transformPoint([mouseX, mouseY]);

      await engine.node.add(blockType, position, factoryData);
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
        onChange={updateViewport}
        onPan={panViewport}
        onZoom={zoomViewport}
        onRegister={registerCanvas}
        onRightClick={contextMenu.onOpen}
        onShiftDragStart={startGroupSelection}
        innerRef={connectBlockDrop}
        onDragStart={onDragStart}
      >
        <LinkLayer />
        <NodeLayer />
        {markup.isEnabled && <MarkupLayer />}
        <MergeLayer />
        <SelectionMarquee />
      </Canvas>
      <TransformOverlay />
    </>
  );
};

export default withInitialViewport(CanvasDiagram);
