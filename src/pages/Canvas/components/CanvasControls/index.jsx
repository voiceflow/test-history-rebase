/* eslint-disable no-shadow */
import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton from '@/components/IconButton';
import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import { diagramByIDSelector } from '@/ducks/diagram';
import { activeDiagramIDSelector, isRootDiagramSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import FlowBar from '@/pages/Canvas/components/FlowBar';
import { EditPermissionContext, ShortcutModalContext } from '@/pages/Canvas/contexts';

import { CanvasControlsContainer, CanvasControlsZoom, CanvasGoHome } from './components';

const ZOOM_DELTA = 15;

function CanvasControls({ withMenu, withDrawer, isRootDiagram, flow }) {
  const eventualEngine = React.useContext(EventualEngineContext);
  const { isTesting } = React.useContext(EditPermissionContext);
  const shortcutModal = React.useContext(ShortcutModalContext);
  const showFlowControls = !isTesting && !isRootDiagram && flow;

  return (
    <>
      {showFlowControls && <CanvasGoHome withMenu={withMenu} withDrawer={withDrawer} />}

      <CanvasControlsContainer withMenu={withMenu} withDrawer={withDrawer}>
        <CanvasControlsZoom>
          <IconButton
            icon="zoomIn"
            onClick={() => {
              eventualEngine.get().canvas.applyTransition();
              eventualEngine.get().canvas.zoomIn(ZOOM_DELTA);
            }}
            variant="standard"
          />
          <IconButton
            icon="zoomOut"
            onClick={() => {
              eventualEngine.get().canvas.applyTransition();
              eventualEngine.get().canvas.zoomOut(ZOOM_DELTA);
            }}
            variant="standard"
          />
        </CanvasControlsZoom>

        <Tooltip distance={19} title="Go to Home" position="top">
          <IconButton icon="home" onClick={() => eventualEngine.get().focusHome()} variant="standard" />
        </Tooltip>
        <Tooltip distance={19} title="See Shortcuts" position="top">
          <IconButton icon="star" onClick={() => shortcutModal.toggle()} variant="standard" />
        </Tooltip>
      </CanvasControlsContainer>

      {showFlowControls && <FlowBar withMenu={withMenu} withDrawer={withDrawer} flow={flow} />}
    </>
  );
}

const mapStateToProps = {
  isRootDiagram: isRootDiagramSelector,
  flow: diagramByIDSelector,
  activeDiagramID: activeDiagramIDSelector,
};

const mergeProps = ({ flow: getFlowByID, activeDiagramID }) => ({
  flow: getFlowByID(activeDiagramID),
});

export default connect(mapStateToProps, null, mergeProps)(CanvasControls);
