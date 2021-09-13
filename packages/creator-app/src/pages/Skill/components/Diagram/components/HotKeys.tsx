import React from 'react';

import { Permission } from '@/config/permissions';
import { CANVAS_ZOOM_DELTA, ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as UI from '@/ducks/ui';
import { useDispatch, useEventualEngine, useHotKeys, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { MarkupContext } from '@/pages/Skill/contexts';
import { useCommentingToggle, useDisableModes } from '@/pages/Skill/hooks';

const HotKeys: React.FC = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [showHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const isCanvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);

  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);

  const markup = React.useContext(MarkupContext)!;

  const getEngine = useEventualEngine();
  const [, trackingEventsWrapper] = useTrackingEvents();

  const imModal = useModals(ModalType.INTERACTION_MODEL);

  const onDisableModes = useDisableModes();
  const onToggleCommenting = useCommentingToggle();

  const onZoomIn = React.useCallback(() => {
    getEngine()?.canvas?.applyTransition();
    getEngine()?.canvas?.zoomIn(CANVAS_ZOOM_DELTA);
  }, []);

  const onZoomOut = React.useCallback(() => {
    getEngine()?.canvas?.applyTransition();
    getEngine()?.canvas?.zoomOut(CANVAS_ZOOM_DELTA);
  }, []);

  const onFocusHome = React.useCallback(() => {
    // to force close any opened tooltips/popovers
    document.body.click();

    getEngine()?.focusHome();
  }, []);

  // this callback is needed to do not store event object in the modals context
  const onOpenImModel = React.useCallback(() => trackingEventsWrapper(() => imModal.open(), 'trackCanvasControlInteractionModel')(), [imModal.open]);

  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.RUN_MODE, () => goToPrototype(), { preventDefault: true, disable: imModal.isOpened });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true });
  useHotKeys(Hotkey.MOVE_MODE, onDisableModes, { preventDefault: true, disable: imModal.isOpened }, [onDisableModes]);
  useHotKeys(Hotkey.SHOW_HIDE_UI, toggleCanvasOnly, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenImModel, { preventDefault: true, disable: !canEditCanvas }, [onOpenImModel]);
  useHotKeys(Hotkey.OPEN_COMMENTING, onToggleCommenting, { preventDefault: true, disable: !showHintFeatures || imModal.isOpened }, [
    onToggleCommenting,
  ]);
  useHotKeys(Hotkey.ADD_MARKUP_TEXT, markup.toggleTextCreating, { preventDefault: true, disable: !showHintFeatures || imModal.isOpened }, [
    markup.toggleTextCreating,
  ]);
  useHotKeys(Hotkey.ADD_MARKUP_IMAGE, markup.triggerImagesUpload, { preventDefault: true, disable: !showHintFeatures || imModal.isOpened }, [
    markup.triggerImagesUpload,
  ]);
  useHotKeys(Hotkey.CLOSE_CANVAS_MODE, onDisableModes, { preventDefault: true }, [onDisableModes]);
  useHotKeys(Hotkey.CLOSE_CANVAS_ONLY_MODE, toggleCanvasOnly, { disable: !isCanvasOnly, preventDefault: true });

  return null;
};

export default HotKeys;
