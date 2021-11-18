import * as Realtime from '@voiceflow/realtime-sdk';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import Canvas from '@/components/Canvas';
import Crosshair from '@/components/Crosshair';
import { RootPageProgressBar } from '@/components/PageProgressBar';
import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT, PageProgressBar } from '@/constants';
import { canvasNavigationSelector } from '@/ducks/ui';
import * as Viewport from '@/ducks/viewport';
import { connect } from '@/hocs';
import { useSetup } from '@/hooks';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import MergeLayer from '@/pages/Canvas/components/MergeLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import SelectionMarquee from '@/pages/Canvas/components/SelectionMarquee';
import TransformOverlay from '@/pages/Canvas/components/TransformOverlay';
import { ContextMenuContext, EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { FolderItemProps } from '@/pages/Project/components/DesignMenu/components/Layers/components/ComponentsSection/components/FolderItem';
import { StepDragItem } from '@/pages/Project/components/DesignMenu/components/Steps/types';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useEditingMode } from '@/pages/Project/hooks';
import perf, { PerfAction } from '@/performance';
import { Viewport as ViewportType } from '@/types';
import { Coords } from '@/utils/geometry';

import { useCursorControls } from './hooks';

const withInitialViewport = connect({ viewport: Viewport.activeDiagramViewportSelector }, null, null, {
  // ignore all further updates to the viewport
  areStatesEqual: () => true,
});

interface ConnectedCanvasDiagramProps {
  viewport: ViewportType;
}

interface BaseDrop {
  type: string;
  clientOffset: XYCoord;
}

interface FilesDrop extends BaseDrop {
  files?: File[];
}

interface StepMenuDrop extends BaseDrop, Omit<StepDragItem, 'type'> {}

interface ComponentsDrop extends BaseDrop, FolderItemProps {}

const DROP_TYPES = [NativeTypes.FILE, DragItem.BLOCK_MENU, DragItem.COMPONENTS];

const CanvasDiagram: React.FC<ConnectedCanvasDiagramProps> = ({ viewport }) => {
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;

  const isEditingMode = useEditingMode();
  const isCommentingMode = useCommentingMode();
  const { panViewport, zoomViewport, updateViewport } = useCursorControls();

  const onMouseUp = React.useCallback((event: MouseEvent) => {
    const nodeRightClicked = event.button === 2;
    const middleMouseButtonClicked = event.button === 1;
    const multiSelect = event.shiftKey;
    if (event.defaultPrevented || engine.isCanvasBusy || nodeRightClicked || middleMouseButtonClicked || multiSelect) {
      return;
    }
    engine.clearActivation();
  }, []);

  const getZoomType = React.useCallback(() => engine.getZoomType(), []);

  const onClickCanvas = React.useCallback(
    async (event: React.MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (markup.creatingType && markup.creatingType === BlockType.MARKUP_TEXT) {
        await engine.markup.addTextNode();

        markup.finishCreating();
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
    [isCommentingMode, markup]
  );

  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  const startGroupSelection = React.useCallback<React.MouseEventHandler>(
    (event) => isEditingMode && engine.groupSelection.start([event.clientX, event.clientY]),
    [isEditingMode]
  );

  const [, connectBlockDrop] = useDrop<FilesDrop | StepMenuDrop | ComponentsDrop, {}, {}>({
    accept: DROP_TYPES,
    drop: async (item, monitor) => {
      if ('files' in item && item.files) {
        markup.addImages(item.files);
        return;
      }

      if (monitor.didDrop() && monitor.getDropResult()?.captured) return;

      const { x: mouseX, y: mouseY } = monitor.getClientOffset() || item.clientOffset;

      if ('blockType' in item) {
        perf.action(PerfAction.STEP_DROP_CREATE);

        await engine.node.add(item.blockType, new Coords([mouseX, mouseY]), item.factoryData);
      }

      if (item.type === DragItem.COMPONENTS && 'searchMatchValue' in item) {
        await engine.node.add(BlockType.COMPONENT, new Coords([mouseX, mouseY]), {
          name: item.item.name,
          diagramID: item.item.id,
        } as Realtime.NodeData<any>);
      }
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

  const navigation = useSelector(canvasNavigationSelector);

  useSetup(() => {
    RootPageProgressBar.stop(PageProgressBar.CANVAS_LOADING);

    perf.action(PerfAction.CANVAS_RENDERED);
  });

  React.useEffect(
    () => () => {
      connectBlockDrop(null);
    },
    [connectBlockDrop]
  );

  return (
    <>
      <Canvas
        controlScheme={navigation}
        viewport={viewport}
        onClick={onClickCanvas}
        onMouseUp={onMouseUp}
        onChange={updateViewport}
        onPan={panViewport}
        onZoom={zoomViewport}
        onRegister={registerCanvas}
        onRightClick={isEditingMode ? contextMenu.onOpen : (e) => e.preventDefault()}
        onSelectDragStart={startGroupSelection}
        innerRef={connectBlockDrop}
        addClass={addClass}
        removeClass={removeClass}
        getZoomType={getZoomType}
      >
        <LinkLayer />
        <NodeLayer />
        <MarkupLayer />
        <MergeLayer />
        <SelectionMarquee />
        <Crosshair portal color="red" withCoords />
        <Crosshair onCanvas />
      </Canvas>
      <TransformOverlay />
    </>
  );
};

export default withInitialViewport(CanvasDiagram);
