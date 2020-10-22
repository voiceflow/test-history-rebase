import cn from 'classnames';
import React from 'react';

import Box from '@/components/Box';
import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import * as Thread from '@/ducks/thread';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useHotKeys, useModals, usePermission, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { COMMENTING_CONTROL_CLASSNAME, MARKUP_CONTROL_CLASSNAME } from '@/pages/Canvas/constants';
import { useCommentingMode, useMarkupMode } from '@/pages/Skill/hooks';
import { ClassName, Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { CanvasControlButton, Container, ControlContainer, UnreadCommentsIndicator, ZoomContainer } from './components';
import { CanvasControl, CanvasControlMeta } from './constants';

const ZOOM_DELTA = 15;

type CanvasControlProps = {
  render: boolean;
};

const CanvasControls: React.FC<CanvasControlProps & ConnectedCanvasControlsProps> = ({ render, isTemplateWorkspace, hasUnreadComments }) => {
  const [trackEvents, trackingEventsWrapper] = useTrackingEvents();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [canUseMarkup] = usePermission(Permission.CANVAS_MARKUP);
  const [canUseCommenting] = usePermission(Permission.COMMENTING);
  const [showHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const cmsModal = useModals(ModalType.INTERACTION_MODEL);
  const markupModal = useModals(ModalType.CANVAS_MARKUP);
  const upgradeModal = useModals(ModalType.PAYMENT);

  const isCommentingMode = useCommentingMode();
  const isMarkupMode = useMarkupMode();

  const eventualEngine = React.useContext(EventualEngineContext)!;

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

  const openMode = (callback: () => void) => {
    if (isTemplateWorkspace) return;

    callback();
  };

  const disableModes = React.useCallback(() => eventualEngine.get()?.disableAllModes(), []);

  const onOpenMarkup = () => {
    if (!canUseMarkup) {
      markupModal.open();

      return;
    }

    openMode(() => eventualEngine.get()?.markup.activate());
  };

  const onOpenCommenting = () => {
    if (!canUseCommenting) {
      upgradeModal.open();

      return;
    }

    trackEvents.trackCommentingOpen();

    openMode(() => eventualEngine.get()?.comment.activate());
  };

  // this callback is needed to do not store event object in the modals context
  const onOpenCMS = React.useCallback(
    () =>
      trackingEventsWrapper(() => {
        if (canEditCanvas) {
          cmsModal.open();
        }
      }, 'trackCanvasControlInteractionModel')(),
    []
  );

  const toggleMarkup = React.useCallback(() => {
    if (isMarkupMode) {
      disableModes();
    } else {
      onOpenMarkup();
    }
  }, [onOpenMarkup, isMarkupMode]);

  const toggleCommenting = React.useCallback(() => {
    if (isCommentingMode) {
      disableModes();
    } else {
      onOpenCommenting();
    }
  }, [onOpenCommenting, isCommentingMode]);

  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenCMS, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_MARKUP, toggleMarkup, { preventDefault: true }, [toggleMarkup]);
  useHotKeys(Hotkey.OPEN_COMMENTING, toggleCommenting, { preventDefault: true }, [toggleCommenting]);
  useHotKeys(Hotkey.CLOSE_CANVAS_MODE, disableModes, { preventDefault: true });

  return (
    <>
      {render && (
        <Container>
          <CanvasControlButton {...CanvasControlMeta[CanvasControl.START]} iconProps={{ id: Identifier.CANVAS_HOME_BUTTON }} onClick={onFocusHome} />
          <CanvasControlButton {...CanvasControlMeta[CanvasControl.MODEL]} onClick={onOpenCMS} />
          {showHintFeatures && (
            <>
              <Box position="relative">
                <CanvasControlButton
                  {...CanvasControlMeta[CanvasControl.COMMENTING]}
                  className={cn(ClassName.CANVAS_CONTROL, COMMENTING_CONTROL_CLASSNAME)}
                  iconProps={{
                    active: isCommentingMode,
                    icon: isCommentingMode ? 'close' : 'comment',
                    size: isCommentingMode ? 14 : 16,
                  }}
                  onClick={toggleCommenting}
                />
                {!isCommentingMode && hasUnreadComments && <UnreadCommentsIndicator />}
              </Box>

              <CanvasControlButton
                {...CanvasControlMeta[CanvasControl.MARKUP]}
                className={cn(ClassName.CANVAS_CONTROL, MARKUP_CONTROL_CLASSNAME)}
                iconProps={{
                  active: isMarkupMode,
                  icon: isMarkupMode ? 'close' : 'editName',
                  size: isMarkupMode ? 14 : 16,
                }}
                onClick={toggleMarkup}
              />
            </>
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
      )}
    </>
  );
};

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
  hasUnreadComments: Thread.hasUnreadCommentsSelector,
};

type ConnectedCanvasControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(CanvasControls) as React.FC<CanvasControlProps>;
