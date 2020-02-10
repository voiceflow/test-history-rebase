/* eslint-disable no-shadow */
import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton from '@/components/IconButton';
import SvgIcon from '@/components/SvgIcon';
import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import { flowStructureSelector } from '@/ducks/diagram';
import { goToRootDiagram } from '@/ducks/router';
import { activeDiagramIDSelector, isRootDiagramSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import FlowBar from '@/pages/Canvas/components/FlowBar';
import { EditPermissionContext, ShortcutModalContext } from '@/pages/Canvas/contexts';

import { CanvasControlsContainer, CanvasControlsZoom, FlowControlsContainer, HomeButton } from './components';

const ZOOM_DELTA = 15;

function CanvasControls({ withMenu, withDrawer, goToRootDiagram, isRootDiagram, flow }) {
  const eventualEngine = React.useContext(EventualEngineContext);
  const { isTesting } = React.useContext(EditPermissionContext);
  const shortcutModal = React.useContext(ShortcutModalContext);
  const showFlowControls = !isTesting && !isRootDiagram && flow;

  return (
    <>
      {showFlowControls && (
        <FlowControlsContainer withMenu={withMenu} withDrawer={withDrawer}>
          <HomeButton onClick={goToRootDiagram}>
            <SvgIcon icon="returnHome" size={13} color="currentColor" />
            <span>Home</span>
          </HomeButton>
        </FlowControlsContainer>
      )}

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
  flowStructure: flowStructureSelector,
  activeDiagramID: activeDiagramIDSelector,
};

const mapDispatchToProps = {
  goToRootDiagram,
};

const mergeProps = ({ flowStructure: getFlowStructure, activeDiagramID }) => ({
  flow: getFlowStructure(activeDiagramID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CanvasControls);
