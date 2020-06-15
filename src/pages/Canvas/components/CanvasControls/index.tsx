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
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { CanvasControlButton, Container, ControlContainer, ResourcesDropdown, ZoomContainer } from './components';
import { CanvasControl, CanvasControlMeta } from './constants';

const ZOOM_DELTA = 15;

const CanvasControls: React.FC<ConnectedCanvasControlsProps> = ({ goToDesign }) => {
  const [, trackingEventsWrapper] = useTrackingEvents();
  const [canUseInteractionModal] = usePermissions(FEATURE_IDS.INTERACTION_MODAL);
  const [canUseMarkup] = usePermissions(FEATURE_IDS.MARKUP);
  const [canUseCommenting] = usePermissions(FEATURE_IDS.COMMENTING);

  const { open } = useModals(ModalType.INTERACTION_MODEL);
  const markupTool = React.useContext(MarkupModeContext);
  const commenting = React.useContext(CommentModeContext);

  const { isPrototyping } = React.useContext(EditPermissionContext)!;
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const markupFeature = useFeature(FeatureFlag.MARKUP);
  const commentingFeature = useFeature(FeatureFlag.COMMENTING);

  const allowCommenting = commentingFeature.isEnabled && canUseCommenting;

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

  // Disable all modes before turning on any mode
  const openMode = (openCb?: () => void) => {
    if (markupTool?.isOpen) {
      markupTool.closeTool();
    } else if (commenting.isOpen) {
      commenting.close();
    }
    if (openCb) {
      openCb();
    }
  };

  const onOpenMarkup = () => {
    if (!canUseMarkup) {
      return;
    }
    if (isPrototyping) {
      goToDesign();
    }
    openMode(markupTool?.openTool);
  };

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

  const toggleCommenting = React.useCallback(() => (commenting.isOpen ? commenting.close() : openMode(commenting.open)), [
    commenting.isOpen,
    commenting.close,
    openMode,
  ]);

  const toggleMarkup = React.useCallback(() => {
    if (markupTool?.isOpen) {
      markupTool.closeTool();
    } else {
      onOpenMarkup();
    }
  }, [onOpenMarkup, markupTool?.closeTool, markupTool?.isOpen]);

  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenCMS, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_MARKUP, toggleMarkup, { preventDefault: true }, [toggleMarkup]);
  useHotKeys(Hotkey.OPEN_COMMENTING, toggleCommenting, { preventDefault: true }, [toggleCommenting]);
  useHotKeys(
    Hotkey.CLOSE_CANVAS_MODE,
    () => {
      markupTool?.closeTool();
      commenting.close();
    },
    { preventDefault: true }
  );

  return (
    <Container>
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.HOME]} iconProps={{ id: Identifier.CANVAS_HOME_BUTTON }} onClick={onFocusHome} />
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.MODEL]} onClick={onOpenCMS} />
      {allowCommenting && (
        <CanvasControlButton
          {...CanvasControlMeta[CanvasControl.COMMENTING]}
          iconProps={{
            active: commenting.isOpen,
            icon: 'comment',
            size: commenting.isOpen ? 14 : 16,
          }}
          onClick={toggleCommenting}
        />
      )}
      {markupFeature.isEnabled && canUseMarkup && (
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
