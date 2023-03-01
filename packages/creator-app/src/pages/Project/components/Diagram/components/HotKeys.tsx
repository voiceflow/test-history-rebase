import React from 'react';

import { CANVAS_ZOOM_DELTA, ModalType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { HotkeysContext } from '@/contexts/HotkeysContext';
import * as Router from '@/ducks/router';
import * as UI from '@/ducks/ui';
import { useDispatch, useEventualEngine, useHotKeys, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';

const HotKeys: React.FC = () => {
  const [hotkeysState] = React.useContext(HotkeysContext)!;
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [showHintFeatures] = usePermission(Permission.CANVAS_HINT_FEATURES);

  const isCanvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);

  const { isOpened: intentCreateModalOpened } = useModals(ModalType.INTENT_CREATE);
  const { isOpened: intentEditModalOpened } = useModals(ModalType.INTENT_EDIT);
  const { isOpened: entityCreateModalOpened } = useModals(ModalType.ENTITY_CREATE);
  const { isOpened: entityEditModalOpened } = useModals(ModalType.ENTITY_EDIT);
  const { isOpened: nluQuickviewOpened } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const disableCanvasHotkeys =
    intentCreateModalOpened || entityCreateModalOpened || nluQuickviewOpened || intentEditModalOpened || entityEditModalOpened;

  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);
  const markup = React.useContext(MarkupContext)!;

  const getEngine = useEventualEngine();
  const [, trackingEventsWrapper] = useTrackingEvents();

  const nluQuickView = useModals(ModalType.NLU_MODEL_QUICK_VIEW);
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSave);

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
  const onOpenImModel = React.useCallback(
    () => trackingEventsWrapper(nluQuickView.open, 'trackCanvasControlInteractionModel')(),
    [nluQuickView.open]
  );

  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true, disable: disableCanvasHotkeys });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true, disable: disableCanvasHotkeys });
  useHotKeys(Hotkey.RUN_MODE, () => goToPrototype(), { preventDefault: true, disable: disableCanvasHotkeys });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true, disable: disableCanvasHotkeys });
  useHotKeys(Hotkey.MOVE_MODE, onDisableModes, { preventDefault: true }, [onDisableModes]);
  useHotKeys(Hotkey.SHOW_HIDE_UI, toggleCanvasOnly, { preventDefault: true });
  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenImModel, { preventDefault: true, disable: !canEditCanvas }, [onOpenImModel]);
  useHotKeys(Hotkey.OPEN_MANUAL_SAVE_MODAL, () => manualSaveModal.openVoid({}), { preventDefault: true, disable: !canEditCanvas }, [
    manualSaveModal.openVoid,
  ]);

  useHotKeys(Hotkey.OPEN_COMMENTING, onToggleCommenting, { preventDefault: true, disable: !showHintFeatures || disableCanvasHotkeys }, [
    onToggleCommenting,
  ]);
  useHotKeys(Hotkey.ADD_MARKUP_TEXT, markup.toggleTextCreating, { preventDefault: true, disable: !showHintFeatures }, [markup.toggleTextCreating]);
  useHotKeys(Hotkey.ADD_MARKUP_IMAGE, markup.triggerMediaUpload, { preventDefault: true, disable: !showHintFeatures }, [markup.triggerMediaUpload]);
  useHotKeys(Hotkey.CLOSE_CANVAS_MODE, onDisableModes, { preventDefault: true, disable: !!hotkeysState.disableCanvasCloseMode.length }, [
    onDisableModes,
  ]);
  useHotKeys(Hotkey.CLOSE_CANVAS_ONLY_MODE, toggleCanvasOnly, { disable: !isCanvasOnly, preventDefault: true });

  return null;
};

export default HotKeys;
