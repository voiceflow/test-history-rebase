import { MenuOption, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { DESKTOP_APP_LINK, ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useDispatch, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';

import { ShareProjectTab } from './constants';
import { SharePopperContext } from './contexts';

export const useLogoButtonOptions = ({
  uiToggle,
  shortcuts,
  toggleSearch,
}: { uiToggle?: boolean; shortcuts?: boolean; toggleSearch?: () => void } = {}): MenuOption<undefined>[] => {
  const goToDashboard = useDispatch(Router.goToDashboard);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);
  const goToCurrentSettings = useDispatch(Router.goToCurrentSettings);
  const [trackingEvents] = useTrackingEvents();
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const goToVersions = useDispatch(Router.goToVersions);

  const sharePopper = React.useContext(SharePopperContext);
  const shortcutModal = useModals(ModalType.SHORTCUTS);
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const onOpenShortcutsModal = React.useCallback(() => {
    shortcutModal.toggle();
    trackingEvents.trackCanvasSeeShortcutsModalOpened();
  }, [shortcutModal]);

  const onVersionHistory = React.useCallback(() => {
    goToVersions(versionID);
  }, [versionID]);

  return React.useMemo<MenuOption<undefined>[]>(
    () => [
      { key: 'dashboard', label: 'Back to dashboard', onClick: goToDashboard },
      { key: 'divider-1', label: 'divider', divider: true },
      ...(toggleSearch
        ? [
            { icon: 'search' as SvgIconTypes.Icon, label: 'Search assistant', onClick: toggleSearch, note: HOTKEY_LABEL_MAP[Hotkey.SEARCH] },
            { key: 'divider-search', label: 'divider', divider: true },
          ]
        : []),
      ...(canEditProject ? [{ label: 'Version history', onClick: onVersionHistory }] : []),
      ...(sharePopper ? [{ key: 'export', label: 'Export as...', onClick: () => sharePopper.open(ShareProjectTab.EXPORT) }] : []),
      ...(canEditProject ? [{ key: 'settings', label: 'Project settings', onClick: goToCurrentSettings }] : []),
      ...(canAddCollaborators && sharePopper
        ? [{ key: 'invite', label: 'Invite collaborators', onClick: () => sharePopper.open(ShareProjectTab.INVITE) }]
        : []),
      ...(uiToggle
        ? [
            { key: 'divider-2', label: 'divider', divider: true },
            { key: 'toggle-ui', label: 'Hide/Show UI', onClick: toggleCanvasOnly, note: HOTKEY_LABEL_MAP[Hotkey.SHOW_HIDE_UI] },
          ]
        : []),
      { key: 'divider-3', label: 'divider', divider: true },
      ...(shortcuts ? [{ key: 'shortcuts', label: 'See shortcuts', onClick: onOpenShortcutsModal }] : []),
      { key: 'desktop-app', label: 'Get desktop app', onClick: () => window.open(DESKTOP_APP_LINK, '_blank') },
    ],
    [sharePopper, uiToggle, shortcuts, canEditProject, shortcutModal.toggle, canAddCollaborators, onVersionHistory]
  );
};
