import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { FEATURE_IDS, ModalType } from '@/constants';
import { EventualEngineContext, usePermissions } from '@/contexts';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useFeature, useHotKeys, useModals, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { CanvasControlButton, Container, ControlContainer, ResourcesDropdown, ZoomContainer } from './components';
import { CanvasControl, CanvasControlMeta } from './constants';

const ZOOM_DELTA = 15;

const CanvasControls: React.FC<ConnectedCanvasControlsProps> = ({ goToDesign }) => {
  const [, trackingEventsWrapper] = useTrackingEvents();
  const [canUseInteractionModal] = usePermissions(FEATURE_IDS.INTERACTION_MODAL);

  const { open } = useModals(ModalType.INTERACTION_MODEL);
  const markupTool = React.useContext(MarkupModeContext);
  const { isPrototyping } = React.useContext(EditPermissionContext)!;
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const markupFeature = useFeature(FeatureFlag.MARKUP);

  const onZoomIn = React.useCallback(() => {
    eventualEngine.get()?.canvas?.applyTransition();
    eventualEngine.get()?.canvas?.zoomIn(ZOOM_DELTA);
  }, [eventualEngine]);

  const onZoomOut = React.useCallback(() => {
    eventualEngine.get()?.canvas?.applyTransition();
    eventualEngine.get()?.canvas?.zoomOut(ZOOM_DELTA);
  }, [eventualEngine]);

  const onFocusHome = React.useCallback(() => {
    eventualEngine.get()?.focusHome();
  }, [eventualEngine]);

  const onOpenMarkup = React.useCallback(() => {
    if (isPrototyping) {
      goToDesign();
    }

    markupTool?.openTool();
  }, [goToDesign, markupTool?.openTool, isPrototyping]);

  // this callback is needed to do not store event object in the modals context
  const onOpenCMS = React.useCallback(
    () =>
      trackingEventsWrapper(() => {
        if (canUseInteractionModal) {
          open();
        }
      }, 'trackCanvasControlInteractionModel')(),
    []
  );

  const toggleMarkup = React.useCallback(() => {
    if (markupTool?.isOpen) {
      markupTool?.closeTool();
    } else {
      onOpenMarkup();
    }
  }, [onOpenMarkup, markupTool?.closeTool, markupTool?.isOpen]);

  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenCMS, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_MARKUP, onOpenMarkup, { preventDefault: true });
  useHotKeys(Hotkey.CLOSE_MARKUP, markupTool?.closeTool || noop, { preventDefault: true });

  return (
    <Container>
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.HOME]} iconProps={{ id: Identifier.CANVAS_HOME_BUTTON }} onClick={onFocusHome} />
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.MODEL]} onClick={onOpenCMS} />
      {markupFeature.isEnabled && (
        <CanvasControlButton
          {...CanvasControlMeta[CanvasControl.MARKUP]}
          iconProps={{
            active: markupTool?.isOpen,
            icon: markupTool?.isOpen ? 'close' : 'editName',
            size: markupTool?.isOpen ? 14 : 16,
          }}
          onClick={toggleMarkup}
        />
      )}

      <ControlContainer>
        <Tooltip distance={6} title="Resources" position="top" hotkey="I">
          <ResourcesDropdown />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <ZoomContainer>
          <Tooltip distance={6} title="Zoom Out" position="top" hotkey="-">
            <IconButton icon="zoomOut" size={14} onClick={onZoomOut} />
          </Tooltip>

          <Tooltip distance={6} title="Zoom In" position="top" hotkey="+">
            <IconButton icon="zoomIn" size={14} onClick={onZoomIn} />
          </Tooltip>
        </ZoomContainer>
      </ControlContainer>
    </Container>
  );
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedCanvasControlsProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(CanvasControls);
