import cuid from 'cuid';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import Canvas from '@/components/Canvas';
import { DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { connect } from '@/hocs';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MergeLayer from '@/pages/Canvas/components/MergeLayer';
import { ContextMenuContext, EditPermissionContext, EngineContext, GroupSelectionContext } from '@/pages/Canvas/contexts';
import { activeDiagramViewportSelector } from '@/store/selectors';

import GroupSelection from './components/GroupSelection';
import NodeLayer from './components/NodeLayer';
import { useCursorControls } from './hooks';

const withInitialViewport = connect({ viewport: activeDiagramViewportSelector }, null, null, {
  // ignore all further updates to the viewport
  // eslint-disable-next-line lodash/prefer-constant
  areStatesEqual: () => true,
});

const CanvasDiagram = ({ viewport }) => {
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
    drop: async ({ clientOffset, blockType, factoryData }, monitor) => {
      const newNodeID = cuid();
      const { x: mouseX, y: mouseY } = monitor.getClientOffset() || clientOffset;

      const position = engine.canvas.transformPoint([mouseX, mouseY]);

      const { newSourceNodeIndex, newTargetNodeID } = engine.mergeV2;

      if (!newTargetNodeID || newSourceNodeIndex === null) {
        await engine.node.add(newNodeID, blockType, position, factoryData);
      } else {
        await engine.node.addNestedV2({
          type: blockType,
          index: newSourceNodeIndex,
          nodeID: newNodeID,
          position,
          factoryData,
          parentNodeID: newTargetNodeID,
        });
      }

      engine.mergeV2.clearNewSourceTypeAndTargetID();
    },
    hover: _throttle(
      (item, monitor) => {
        item.clientOffset = monitor.getClientOffset();

        if (!monitor.isOver({ shallow: true })) {
          return;
        }

        if (engine.mergeV2.newTargetNodeID) {
          engine.mergeV2.clearNewSourceTypeAndTargetID();
        }
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),
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
      <LinkLayer />
      <NodeLayer />
      <MergeLayer />
      <GroupSelection />
    </Canvas>
  );
};

export default withInitialViewport(CanvasDiagram);
