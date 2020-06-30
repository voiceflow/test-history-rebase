import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useHotKeys, useModals, usePermission, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { CanvasControlButton, Container, ControlContainer, ZoomContainer } from './components';
import { CanvasControl, CanvasControlMeta } from './constants';

const ZOOM_DELTA = 15;

const CanvasControls: React.FC<ConnectedCanvasControlsProps> = ({ isTemplateWorkspace, goToDesign }) => {
  const [, trackingEventsWrapper] = useTrackingEvents();
  const [canUseInteractionModal] = usePermission(Permission.INTERACTION_MODAL);
  const [canUseMarkup] = usePermission(Permission.MARKUP);
  const [canUseCommenting] = usePermission(Permission.COMMENTING);

  const cmsModal = useModals(ModalType.INTERACTION_MODEL);
  const markupModal = useModals(ModalType.CANVAS_MARKUP);
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
  const openMode = (openCb?: () => void, allowedToUse = true) => {
    if (isTemplateWorkspace || !allowedToUse) return;

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
      markupModal.open();

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
          cmsModal.open();
        }
      }, 'trackCanvasControlInteractionModel')(),
    []
  );

  const toggleCommenting = React.useCallback(() => (commenting.isOpen ? commenting.close() : openMode(commenting.open, allowCommenting)), [
    allowCommenting,
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
      {!isTemplateWorkspace && allowCommenting && (
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
      {!isTemplateWorkspace && markupFeature.isEnabled && (
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

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedCanvasControlsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasControls);
