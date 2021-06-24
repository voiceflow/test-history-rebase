import { IconButton, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { Permission } from '@/config/permissions';
import { BlockType, ModalType } from '@/constants';
import * as Thread from '@/ducks/thread';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useEventualEngine, useHotKeys, useModals, usePermission, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { COMMENTING_CONTROL_CLASSNAME, MARKUP_IMAGE_CONTROL_CLASSNAME, MARKUP_TEXT_CONTROL_CLASSNAME } from '@/pages/Canvas/constants';
import { MarkupContext } from '@/pages/Skill/contexts';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { ClassName, Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { CanvasControlButton, Container, ControlContainer, UnreadCommentsIndicator, ZoomContainer } from './components';
import { CanvasControl, CanvasControlMeta } from './constants';

const ZOOM_DELTA = 15;

type CanvasControlProps = {
  render: boolean;
};

const CanvasControls: React.FC<CanvasControlProps & ConnectedCanvasControlsProps> = ({ render, isTemplateWorkspace, hasUnreadComments }) => {
  const markup = React.useContext(MarkupContext)!;

  const [, trackingEventsWrapper] = useTrackingEvents();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [canUseCommenting] = usePermission(Permission.COMMENTING);
  const [showHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const cmsModal = useModals(ModalType.INTERACTION_MODEL);
  const upgradeModal = useModals(ModalType.PAYMENT);

  const isCommentingMode = useCommentingMode();

  const engine = useEventualEngine();

  const onZoomIn = React.useCallback(() => {
    engine()?.canvas?.applyTransition();
    engine()?.canvas?.zoomIn(ZOOM_DELTA);
  }, []);

  const onZoomOut = React.useCallback(() => {
    engine()?.canvas?.applyTransition();
    engine()?.canvas?.zoomOut(ZOOM_DELTA);
  }, []);

  const onFocusHome = React.useCallback(() => {
    // to force close any opened tooltips/popovers
    document.body.click();

    engine()?.focusHome();
  }, []);

  const disableModes = React.useCallback(() => {
    if (engine()?.markup.creatingType) {
      engine()?.markup.finishCreating?.();
    } else {
      engine()?.disableAllModes();
    }
  }, [markup]);

  const onOpenCommenting = () => {
    if (isTemplateWorkspace) {
      return;
    }

    if (!canUseCommenting) {
      upgradeModal.open();

      return;
    }

    engine()?.comment.activate();
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

  const toggleCommenting = React.useCallback(() => {
    if (isCommentingMode) {
      disableModes();
    } else {
      onOpenCommenting();
    }
  }, [onOpenCommenting, isCommentingMode]);

  const toggleMarkupText = React.useCallback(() => {
    if (markup.creatingType) {
      markup.finishCreating();
    } else {
      markup.startTextCreation();
    }
  }, [markup]);

  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true, disable: engine()?.isNodeFocused() });
  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenCMS, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_COMMENTING, toggleCommenting, { preventDefault: true }, [toggleCommenting]);
  useHotKeys(Hotkey.ADD_MARKUP_TEXT, toggleMarkupText, { preventDefault: true }, [toggleMarkupText]);
  useHotKeys(Hotkey.ADD_MARKUP_IMAGE, markup.triggerImagesUpload, { preventDefault: true }, [markup.triggerImagesUpload]);
  useHotKeys(Hotkey.CLOSE_CANVAS_MODE, disableModes, { preventDefault: true }, []);

  if (!render) return null;

  const isMarkupTextCreation = markup.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupImageCreation = markup.creatingType === BlockType.MARKUP_IMAGE;

  return (
    <Container>
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.START]} iconProps={{ id: Identifier.CANVAS_HOME_BUTTON }} onClick={onFocusHome} />
      <CanvasControlButton {...CanvasControlMeta[CanvasControl.MODEL]} onClick={onOpenCMS} />

      {showHintFeatures && (
        <>
          <CanvasControlButton
            {...CanvasControlMeta[CanvasControl.COMMENTING]}
            className={cn(ClassName.CANVAS_CONTROL, COMMENTING_CONTROL_CLASSNAME)}
            iconProps={{
              active: isCommentingMode,
              icon: isCommentingMode ? 'close' : CanvasControlMeta[CanvasControl.COMMENTING].icon,
              size: isCommentingMode ? 14 : 16,
            }}
            onClick={toggleCommenting}
          />

          {!isCommentingMode && hasUnreadComments && <UnreadCommentsIndicator />}

          <CanvasControlButton
            {...CanvasControlMeta[CanvasControl.MARKUP_TEXT]}
            onClick={toggleMarkupText}
            className={cn(ClassName.CANVAS_CONTROL, MARKUP_TEXT_CONTROL_CLASSNAME)}
            iconProps={{ size: 14, active: isMarkupTextCreation }}
          />

          <CanvasControlButton
            {...CanvasControlMeta[CanvasControl.MARKUP_IMAGE]}
            onClick={markup.triggerImagesUpload}
            className={cn(ClassName.CANVAS_CONTROL, MARKUP_IMAGE_CONTROL_CLASSNAME)}
            iconProps={{ active: isMarkupImageCreation }}
          />
        </>
      )}

      <ControlContainer>
        <ZoomContainer>
          <TippyTooltip
            title={CanvasControlMeta[CanvasControl.ZOOM_OUT].title}
            hotkey={CanvasControlMeta[CanvasControl.ZOOM_OUT].hotkey}
            distance={8}
            position="top"
          >
            <IconButton icon={CanvasControlMeta[CanvasControl.ZOOM_OUT].icon} size={14} onClick={onZoomOut} />
          </TippyTooltip>

          <TippyTooltip
            title={CanvasControlMeta[CanvasControl.ZOOM_IN].title}
            hotkey={CanvasControlMeta[CanvasControl.ZOOM_IN].hotkey}
            distance={8}
            position="top"
          >
            <IconButton icon={CanvasControlMeta[CanvasControl.ZOOM_IN].icon} size={14} onClick={onZoomIn} />
          </TippyTooltip>
        </ZoomContainer>
      </ControlContainer>
    </Container>
  );
};

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
  hasUnreadComments: Thread.hasUnreadCommentsSelector,
};

type ConnectedCanvasControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(CanvasControls) as React.FC<CanvasControlProps>;
