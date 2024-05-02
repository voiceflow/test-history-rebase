import type { EmptyObject, Nullable } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import type { SvgIconTypes } from '@voiceflow/ui';
import type { ITreeData } from '@voiceflow/ui-next';
import _throttle from 'lodash/throttle';
import React from 'react';
import type { XYCoord } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import type { CanvasAPI } from '@/components/Canvas';
import Canvas from '@/components/Canvas';
import Crosshair from '@/components/Crosshair';
import type { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { PageProgress } from '@/components/PageProgressBar';
import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT, PageProgressBar } from '@/constants';
import * as UI from '@/ducks/ui';
import * as Viewport from '@/ducks/viewport';
import { useInitialValueSelector, useSelector, useSetup } from '@/hooks';
import AutoPanLayer from '@/pages/Canvas/components/AutoPanLayer';
import CustomBlockSync from '@/pages/Canvas/components/CustomBlockSync';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import MergeLayer from '@/pages/Canvas/components/MergeLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import SelectionMarquee from '@/pages/Canvas/components/SelectionMarquee';
import TransformOverlay from '@/pages/Canvas/components/TransformOverlay';
import { CanvasAction } from '@/pages/Canvas/constants';
import { ContextMenuContext, EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { LibraryStepType } from '@/pages/Project/components/StepMenu/constants';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useEditingMode } from '@/pages/Project/hooks';
import { pointerNodeDataFactory } from '@/utils/customBlock';
import { Coords } from '@/utils/geometry';

import { useCursorControls } from './hooks';
import { isLibraryDragItem } from './utils';

export interface StepDragItem {
  type: DragItem;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  blockType: BlockType;
  factoryData?: Realtime.NodeData<any>;
  iconColor?: string;
}

interface ComponentItem {
  id: string;
  name: string;
  children: ComponentItem[];
  isFolder: boolean;
}

interface CanvasTemplateItem {
  id: string;
  name: string;
  nodeIDs: string[];
  color: string | null;
}
export interface FolderItemProps extends ItemComponentProps<ComponentItem>, DragPreviewComponentProps {
  isSearch: boolean;
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

export interface CanvasTemplateItemProps extends ItemComponentProps<CanvasTemplateItem>, DragPreviewComponentProps {}

interface BaseDrop {
  type: string;
  clientOffset: XYCoord;
}

interface FilesDrop extends BaseDrop {
  files?: File[];
}

interface StepMenuDrop extends BaseDrop, Omit<StepDragItem, 'type'> {}

interface ComponentsDrop extends BaseDrop, FolderItemProps {}
type DroppableItem =
  | FilesDrop
  | StepMenuDrop
  | ComponentsDrop
  | (ITreeData<{ type: 'flow'; diagramID: string }> & { source: 'tree-view' });

const DROP_TYPES = [NativeTypes.FILE, DragItem.BLOCK_MENU, DragItem.COMPONENTS, DragItem.LIBRARY, 'element'];

const CanvasDiagram: React.FC<React.PropsWithChildren> = ({ children }) => {
  const canvasGridEnabled = useSelector(UI.selectors.isCanvasGrid);
  const viewport = useInitialValueSelector(Viewport.activeDiagramViewportSelector);

  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const focusThread = React.useContext(FocusThreadContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;
  const isEditingMode = useEditingMode();
  const isCommentingMode = useCommentingMode();
  const { panViewport, zoomViewport, updateViewport } = useCursorControls();

  const onMouseUp = React.useCallback(
    (event: MouseEvent) => {
      const multiSelect = event.shiftKey;
      const contextMenu = event.ctrlKey;
      const nodeRightClicked = event.button === 2;
      const middleMouseButtonClicked = event.button === 1;

      if (
        event.defaultPrevented ||
        engine.isCanvasBusy ||
        nodeRightClicked ||
        middleMouseButtonClicked ||
        multiSelect ||
        contextMenu ||
        isCommentingMode
      ) {
        return;
      }

      engine.clearActivation();
    },
    [isCommentingMode]
  );

  const getZoomType = React.useCallback(() => engine.getZoomType(), []);

  const onClickCanvas = React.useCallback(
    async (event: React.MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (markup.creatingType && markup.creatingType === BlockType.MARKUP_TEXT) {
        markup.finishCreating();
        await engine.markup.addTextNode();
      }

      if (isCommentingMode && !engine.comment.hasTarget) {
        if (engine.comment.isCreating || engine.comment.hasFocus) {
          focusThread.resetFocus({ syncURL: true });
        } else {
          focusThread.resetFocus({ syncURL: true });
          engine.comment.startThread();
        }
      }
    },
    [isCommentingMode, markup]
  );

  const registerCanvas = React.useCallback((api: CanvasAPI | null) => engine.registerCanvas(api), []);

  const startGroupSelection = React.useCallback<React.MouseEventHandler>(
    (event) => isEditingMode && engine.groupSelection.start([event.clientX, event.clientY]),
    [isEditingMode]
  );

  const [, connectBlockDrop] = useDrop<DroppableItem, EmptyObject, EmptyObject>({
    accept: DROP_TYPES,
    drop: async (item, monitor) => {
      if ('files' in item && item.files) {
        markup.addMedia(item.files);
        return;
      }

      if (monitor.didDrop() && monitor.getDropResult<{ captured?: boolean }>()?.captured) return;

      const offset = monitor.getClientOffset();
      if (!offset) return;

      const { x: mouseX, y: mouseY } = offset;
      const coords = new Coords([mouseX, mouseY]);

      // $TODO$ - Need to extract this specific knowledge out, e.g, using polymorphism to abstract these
      // specific calls. This list of calls is awkward to read.
      if ('blockType' in item) {
        await engine.node.add({ type: item.blockType, coords, factoryData: item.factoryData });
      } else if (item.type === DragItem.COMPONENTS && 'searchMatchValue' in item) {
        await engine.node.add({
          type: BlockType.COMPONENT,
          coords,
          factoryData: { name: item.item.name, diagramID: item.item.id },
        });
      } else if (isLibraryDragItem(item)) {
        if (item.libraryType === LibraryStepType.CUSTOM_BLOCK) {
          await engine.node.add({
            type: BlockType.CUSTOM_BLOCK_POINTER,
            coords,
            factoryData: pointerNodeDataFactory(item.tabData),
          });
        } else if (item.libraryType === LibraryStepType.BLOCK_TEMPLATES) {
          await engine.canvasTemplate.dropTemplate(item.tabData.id, coords);
        }
      } else if ('source' in item && item.source === 'tree-view' && item.metaData.type === 'flow') {
        await engine.node.add({
          type: BlockType.COMPONENT,
          coords,
          factoryData: { name: item.label, diagramID: item.metaData.diagramID },
        });
      }
    },

    hover: _throttle(
      (item, monitor) => {
        // eslint-disable-next-line no-param-reassign
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

  const navigation = useSelector(UI.selectors.canvasNavigation);

  useSetup(() => {
    PageProgress.stop(PageProgressBar.CANVAS_LOADING);
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
        viewport={viewport ?? undefined}
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
        canvasGridEnabled={canvasGridEnabled}
        getZoomType={getZoomType}
        layers={children}
        onPanApplied={(movement) => engine.emitter.emit(CanvasAction.PAN_APPLIED, movement)}
        onZoomApplied={(calculateMovement) => engine.emitter.emit(CanvasAction.ZOOM_APPLIED, calculateMovement)}
      >
        <AutoPanLayer />
        <CustomBlockSync />
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

export default CanvasDiagram;
