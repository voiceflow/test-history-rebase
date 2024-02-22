import React from 'react';

import { CANVAS_ZOOM_DELTA } from '@/constants';
import { Permission } from '@/constants/permissions';
import { HotkeysContext } from '@/contexts/HotkeysContext';
import * as Router from '@/ducks/router';
import * as UI from '@/ducks/ui';
import { useDispatch, useEventualEngine, useHotkeyList, usePermission, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';

const HotKeys: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;
  const [hotkeysState] = React.useContext(HotkeysContext)!;

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [showHintFeatures] = usePermission(Permission.CANVAS_HINT_FEATURES);

  const isCanvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);

  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);

  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSaveBackup);

  const activeModalID = ModalsV2.useActiveModalID();

  const getEngine = useEventualEngine();

  const onDisableModes = useDisableModes();
  const onToggleCommenting = useCommentingToggle();

  const onZoomIn = () => {
    const engine = getEngine();

    engine?.canvas?.applyTransition();
    engine?.canvas?.zoomIn(CANVAS_ZOOM_DELTA);
  };

  const onZoomOut = () => {
    const engine = getEngine();

    engine?.canvas?.applyTransition();
    engine?.canvas?.zoomOut(CANVAS_ZOOM_DELTA);
  };

  const onFocusHome = () => {
    // to force close any opened tooltips/popovers
    document.body.click();

    getEngine()?.focusHome();
  };

  const disableEditHotkeys = !canEditCanvas;
  const disableCanvasHotkeys = !!activeModalID;
  const disableHintHotkeys = disableCanvasHotkeys || !showHintFeatures;
  const disableCanvasCloseMode = !!hotkeysState.disableCanvasCloseMode.length;

  useHotkeyList(
    [
      { hotkey: Hotkey.ZOOM_IN, callback: onZoomIn, preventDefault: true, disable: disableCanvasHotkeys },
      { hotkey: Hotkey.ZOOM_OUT, callback: onZoomOut, preventDefault: true, disable: disableCanvasHotkeys },
      { hotkey: Hotkey.RUN_MODE, callback: () => goToPrototype(), preventDefault: true, disable: disableCanvasHotkeys },
      { hotkey: Hotkey.ROOT_NODE, callback: onFocusHome, preventDefault: true, disable: disableCanvasHotkeys },
      { hotkey: Hotkey.MOVE_MODE, callback: onDisableModes, preventDefault: true },
      { hotkey: Hotkey.SHOW_HIDE_UI, callback: toggleCanvasOnly, preventDefault: true },
      { hotkey: Hotkey.OPEN_COMMENTING, callback: onToggleCommenting, preventDefault: true, disable: disableHintHotkeys },
      { hotkey: Hotkey.ADD_MARKUP_NOTE, callback: markup.toggleTextCreating, preventDefault: true, disable: disableHintHotkeys },
      { hotkey: Hotkey.ADD_MARKUP_IMAGE, callback: markup.triggerMediaUpload, preventDefault: true, disable: disableHintHotkeys },
      { hotkey: Hotkey.CLOSE_CANVAS_MODE, callback: onDisableModes, preventDefault: true, disable: disableCanvasCloseMode },
      { hotkey: Hotkey.OPEN_MANUAL_SAVE_MODAL, callback: () => manualSaveModal.openVoid({}), preventDefault: true, disable: disableEditHotkeys },
      { hotkey: Hotkey.CLOSE_CANVAS_ONLY_MODE, callback: toggleCanvasOnly, preventDefault: true, disable: !isCanvasOnly },
    ],
    [disableEditHotkeys, disableCanvasHotkeys, disableHintHotkeys, disableCanvasCloseMode, isCanvasOnly]
  );

  return null;
};

export default HotKeys;
