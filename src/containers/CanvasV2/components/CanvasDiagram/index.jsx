import cuid from 'cuid';
import React from 'react';
import { useDrop } from 'react-dnd';

import Canvas from '@/components/Canvas';
import { DragItem } from '@/constants';
import LinkLayer from '@/containers/CanvasV2/components/LinkLayer';
import { ContextMenuContext, EditPermissionContext, EngineContext, GroupSelectionContext } from '@/containers/CanvasV2/contexts';
import { connect } from '@/hocs';
import { activeDiagramViewportSelector } from '@/store/selectors';

import GroupSelection from './components/GroupSelection';
import NodeLayer from './components/NodeLayer';
import { useCursorControls } from './hooks';

const withInitialViewport = connect(
  { viewport: activeDiagramViewportSelector },
  null,
  null,
  {
    // ignore all further updates to the viewport
    // eslint-disable-next-line lodash/prefer-constant
    areStatesEqual: () => true,
  }
);

const CanvasDiagram = ({ viewport, renderLinks }) => {
  const engine = React.useContext(EngineContext);
  const groupSelection = React.useContext(GroupSelectionContext);
  const contextMenu = React.useContext(ContextMenuContext);
  const { canEdit } = React.useContext(EditPermissionContext);

  const { panViewport, zoomViewport, updateViewport } = useCursorControls();

  const onClickCanvas = React.useCallback(() => engine.clearActivation(), []);
  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  const startGroupSelection = React.useCallback(({ clientX, clientY }) => canEdit && groupSelection.onStart([clientX, clientY]), [
    canEdit,
    groupSelection.onStart,
  ]);

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,
    drop: async ({ blockType }, monitor) => {
      const newNodeID = cuid();
      const { x: mouseX, y: mouseY } = monitor.getClientOffset();

      const position = engine.canvas.transformPoint([mouseX, mouseY]);

      await engine.node.add(newNodeID, blockType, position);
    },
  });

  return (
    <Canvas
      viewport={viewport}
      onClick={onClickCanvas}
      onChange={updateViewport}
      onPan={panViewport}
      onZoom={zoomViewport}
      onRegister={registerCanvas}
      onRightClick={contextMenu.onOpen}
      onShiftClick={startGroupSelection}
      innerRef={connectBlockDrop}
    >
      <LinkLayer renderLinks={renderLinks} />
      <NodeLayer />
      <GroupSelection />
    </Canvas>
  );
};

export default withInitialViewport(CanvasDiagram);
