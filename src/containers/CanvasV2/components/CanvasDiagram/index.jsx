import cuid from 'cuid';
// import mouseEventOffset from 'mouse-event-offset';
import React from 'react';
import { useDrop } from 'react-dnd';

import Canvas from '@/components/Canvas';
import { DragItem } from '@/constants';
import { ContextMenuContext, EngineContext, GroupSelectionContext, TestingModeContext } from '@/containers/CanvasV2/contexts';
import { sendMouseMovement } from '@/ducks/realtime';
import { connect } from '@/hocs';
import { activeDiagramViewportSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

import GroupSelection from './components/GroupSelection';
import LinkLayer from './components/LinkLayer';
import NodeLayer from './components/NodeLayer';

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
  const isTesting = React.useContext(TestingModeContext);
  const startGroupSelection = ({ clientX, clientY }) => !isTesting && groupSelection.onStart([clientX, clientY]);
  const onClickCanvas = () => engine.clearActivation();

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,
    drop: ({ blockType }, monitor) => {
      const newNodeID = cuid();
      const { x: mouseX, y: mouseY } = monitor.getClientOffset();

      const position = engine.canvas.transformPoint([mouseX, mouseY]);

      engine.node.add(newNodeID, blockType, position);
    },
  });

  const registerCanvas = (api) => engine.registerCanvas(api);
  const updateViewport = ({ x, y, zoom }) => engine.updateViewport(x, y, zoom);
  const panViewport = (moveX, moveY) => engine.realtime.panViewport(moveX, moveY);
  const zoomViewport = (calculateMovement) => engine.realtime.zoomViewport(calculateMovement);

  // React.useEffect(() => {
  //   if (engine.canvas) {
  //     const onMouseMove = (event) => {
  //       if (!engine.canvas.isPanning()) {
  //         const transformedPoint = engine.canvas.transformPoint(mouseEventOffset(event, engine.canvas.getRef()), true);
  //         sendMouseMovement(transformedPoint);
  //       }
  //     };

  //     document.addEventListener('mousemove', onMouseMove);

  //     return () => document.removeEventListener('mousemove', onMouseMove);
  //   }
  // }, [engine.canvas]);

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

const mapDispatchToProps = {
  sendMouseMovement,
};

export default compose(
  withInitialViewport,
  connect(
    null,
    mapDispatchToProps
  )
)(CanvasDiagram);
