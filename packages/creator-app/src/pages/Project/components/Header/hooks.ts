import { Nullable } from '@voiceflow/common';
import { MenuTypes, SvgIconTypes } from '@voiceflow/ui';

import { DESKTOP_APP_LINK } from '@/constants';
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
}: { uiToggle?: boolean; shortcuts?: boolean; toggleSearch?: () => void } = {}): Nullable<MenuTypes.OptionWithoutValue>[] => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const goToDashboard = useDispatch(Router.goToDashboard);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);

  const shortcutModal = ModalsV2.useModal(ModalsV2.Canvas.Shortcuts);

  const [, wrapTrackingEvent] = useTrackingEvents();

  const options = useProjectOptions({
    projectID,
    withDelete: false,
    withInvite: true,
  });

  return [
    { label: 'Back to dashboard', onClick: goToDashboard },

    { label: 'divider 1', divider: true },

    toggleSearch
      ? { icon: 'search' as SvgIconTypes.Icon, label: 'Search assistant', onClick: toggleSearch, note: HOTKEY_LABEL_MAP[Hotkey.SEARCH] }
      : null,

    toggleSearch ? { label: 'divider 2', divider: true } : null,

    ...options,

    uiToggle ? { key: 'divider 3', label: 'divider', divider: true } : null,
    uiToggle ? { key: 'toggle-ui', label: 'Hide/Show UI', onClick: toggleCanvasOnly, note: HOTKEY_LABEL_MAP[Hotkey.SHOW_HIDE_UI] } : null,

    { key: 'divider-3', label: 'divider', divider: true },

    shortcuts
      ? { key: 'shortcuts', label: 'See shortcuts', onClick: wrapTrackingEvent(() => shortcutModal.openVoid(), 'trackCanvasSeeShortcutsModalOpened') }
      : null,

    { key: 'desktop-app', label: 'Get desktop app', onClick: onOpenInternalURLInANewTabFactory(DESKTOP_APP_LINK) },
  ];
};
