import { Nullable } from '@voiceflow/common';
import { MenuTypes } from '@voiceflow/ui';
import { BaseProps } from '@voiceflow/ui-next';

import { DESKTOP_APP_LINK } from '@/constants/link.constant';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const useLogoButtonOptions = ({
  uiToggle,
  shortcuts,
  toggleSearch,
}: { uiToggle?: boolean; shortcuts?: boolean; toggleSearch?: () => void } = {}): Nullable<MenuTypes.OptionWithoutValue & BaseProps>[] => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const goToDashboard = useDispatch(Router.goToDashboard);
  const toggleCanvasOnly = useDispatch(UI.action.ToggleCanvasOnly);

  const shortcutModal = ModalsV2.useModal(ModalsV2.Canvas.Shortcuts);

  const [, wrapTrackingEvent] = useTrackingEvents();

  const options = useProjectOptions({
    canvas: true,
    projectID,
    withDelete: false,
    withInvite: true,
  });

  return [
    { key: 'back', label: 'Back to dashboard', onClick: goToDashboard },

    { key: 'logo-divider-1', label: 'logo-divider-1', divider: true },

    toggleSearch
      ? { key: 'search', icon: 'search' as const, label: 'Search agent', onClick: toggleSearch, note: HOTKEY_LABEL_MAP[Hotkey.SEARCH] }
      : null,

    toggleSearch && options.length ? { key: 'logo-divider-2', label: 'logo-divider-2', divider: true } : null,

    ...options,

    uiToggle && options.length ? { key: 'logo-divider-3', label: 'logo-divider-3', divider: true } : null,
    uiToggle
      ? { key: 'toggle-ui', label: 'Hide/Show UI', onClick: () => toggleCanvasOnly(), note: HOTKEY_LABEL_MAP[Hotkey.CANVAS_SHOW_HIDE_UI] }
      : null,

    options.length || uiToggle ? { key: 'logo-divider-4', label: 'logo-divider-4', divider: true } : null,

    shortcuts
      ? { key: 'shortcuts', label: 'See shortcuts', onClick: wrapTrackingEvent(() => shortcutModal.openVoid(), 'trackCanvasSeeShortcutsModalOpened') }
      : null,

    { key: 'desktop-app', label: 'Get desktop app', onClick: onOpenInternalURLInANewTabFactory(DESKTOP_APP_LINK) },
  ];
};
