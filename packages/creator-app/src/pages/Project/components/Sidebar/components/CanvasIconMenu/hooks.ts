import { MenuOption } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { useRouteMatch } from 'react-router-dom';

import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, DOCS_LINK, FORUM_LINK, ModalType, YOUTUBE_CHANNEL_LINK } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useFeature, useHotKeys, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';

export enum CanvasOptionType {
  HELP = 'HELP',
  SETTINGS = 'SETTINGS',
  DESIGNER = 'DESIGNER',
  INTEGRATION = 'INTEGRATION',
  CONVERSATION = 'CONVERSATION',
  NLU_MANAGER = 'NLU_MANAGER',
}

const RouteCanvasOptionMap: Record<CanvasOptionType, string[]> = {
  [CanvasOptionType.HELP]: [],
  [CanvasOptionType.DESIGNER]: [],
  [CanvasOptionType.SETTINGS]: [Path.PROJECT_SETTINGS],
  [CanvasOptionType.INTEGRATION]: [Path.PROJECT_PUBLISH],
  [CanvasOptionType.CONVERSATION]: [Path.CONVERSATIONS],
  [CanvasOptionType.NLU_MANAGER]: [Path.NLU_MANAGER],
};

export const useCanvasMenuOptionsAndHotkeys = () => {
  const imModal = useModals(ModalType.INTERACTION_MODEL);
  const nluManager = useFeature(FeatureFlag.NLU_MANAGER);

  const match = useRouteMatch();
  const hasUnreadTranscripts = useSelector(Transcript.hasUnreadTranscriptsSelector);

  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);
  const goToCurrentSettings = useDispatch(Router.goToCurrentSettings);
  const goToCurrentTranscript = useDispatch(Router.goToCurrentTranscript);
  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);

  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const helpButtonRef = React.useRef<HTMLDivElement | null>(null);

  const [helpOpened, toggleHelpOpened] = useDismissable(false, { ref: helpButtonRef });

  useHotKeys(Hotkey.DESIGN_PAGE, goToCurrentCanvas, { preventDefault: true, disable: imModal.isOpened });
  useHotKeys(Hotkey.SETTINGS_PAGE, goToCurrentSettings, { preventDefault: true, disable: !canEditProject || imModal.isOpened });
  useHotKeys(Hotkey.INTEGRATION_PAGE, goToCurrentPublish, { preventDefault: true, disable: !canEditProject || imModal.isOpened });
  useHotKeys(Hotkey.CONVERSATION_PAGE, goToCurrentTranscript, { preventDefault: true, disable: imModal.isOpened });
  useHotKeys(Hotkey.NLU_MANAGER_PAGE, goToNLUManager, { preventDefault: true, disable: !nluManager.isEnabled });

  const options = React.useMemo<SidebarIconMenuItem[]>(
    () => [
      {
        value: CanvasOptionType.DESIGNER,
        icon: 'designer',
        tooltip: { title: 'Designer', hotkey: HOTKEY_LABEL_MAP[Hotkey.DESIGN_PAGE] },
        onClick: goToCurrentCanvas,
      },
      ...(nluManager.isEnabled
        ? [
            {
              value: CanvasOptionType.NLU_MANAGER,
              icon: 'interactionModel' as const,
              tooltip: { title: 'NLU Manager', hotkey: HOTKEY_LABEL_MAP[Hotkey.CONVERSATION_PAGE] },
              onClick: goToNLUManager,
            },
          ]
        : []),
      ...(canViewConversations
        ? [
            {
              value: CanvasOptionType.CONVERSATION,
              icon: 'conversations' as const,
              tooltip: { title: 'Transcripts', hotkey: HOTKEY_LABEL_MAP[Hotkey.CONVERSATION_PAGE] },
              onClick: goToCurrentTranscript,
              withBadge: hasUnreadTranscripts,
            },
          ]
        : []),
      ...(canEditProject
        ? [
            {
              value: CanvasOptionType.INTEGRATION,
              icon: 'integrations' as const,
              tooltip: { title: 'Integration', hotkey: HOTKEY_LABEL_MAP[Hotkey.INTEGRATION_PAGE] },
              onClick: goToCurrentPublish,
            },
            {
              value: CanvasOptionType.SETTINGS,
              icon: 'cog' as const,
              tooltip: { title: 'Project Settings', hotkey: HOTKEY_LABEL_MAP[Hotkey.SETTINGS_PAGE] },
              onClick: goToCurrentSettings,
            },
          ]
        : []),
    ],
    [canEditProject]
  );

  const footerOptions = React.useMemo<SidebarIconMenuItem[]>(
    () => [
      {
        value: CanvasOptionType.HELP,
        icon: 'info',
        small: true,
        tooltip: { title: 'Help' },
        onClick: (event) => {
          helpButtonRef.current = event.currentTarget;
          toggleHelpOpened();
        },
      },
    ],
    []
  );

  const activeValue = React.useMemo(() => {
    if (helpOpened) {
      return CanvasOptionType.HELP;
    }

    if (!match) {
      return CanvasOptionType.DESIGNER;
    }

    const matchedOption = (Object.entries(RouteCanvasOptionMap) as [CanvasOptionType, string[]][]).find(([, paths]) =>
      paths.includes(match.path)
    )?.[0];

    return matchedOption ?? CanvasOptionType.DESIGNER;
  }, [match, helpOpened]);

  return {
    options,
    helpOpened,
    activeValue,
    helpButtonRef,
    footerOptions,
  };
};

export const useHelpOptions = () => {
  const isIntercomVisible = useSelector(Session.isIntercomVisibleSelector);

  const showIntercom = useDispatch(Session.showIntercom);
  const hideIntercom = useDispatch(Session.hideIntercom);

  const [, trackingEventsWrapper] = useTrackingEvents();

  return React.useMemo<MenuOption<undefined>[]>(
    () => [
      {
        key: 'docs',
        label: 'Documentation',
        onClick: trackingEventsWrapper(() => window.open(DOCS_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', {
          resource: 'Docs',
        }),
      },
      {
        key: 'videos',
        label: 'Video tutorials',
        onClick: trackingEventsWrapper(() => window.open(YOUTUBE_CHANNEL_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', {
          resource: 'Videos',
        }),
      },
      {
        key: 'forum',
        label: 'Community',
        onClick: trackingEventsWrapper(() => window.open(FORUM_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', {
          resource: 'Forum',
        }),
      },
      { key: 'divider', label: 'Divider', divider: true },
      {
        key: 'demo',
        label: 'Book a demo',
        onClick: trackingEventsWrapper(() => window.open(BOOK_DEMO_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', {
          resource: 'Demo',
        }),
      },
      {
        key: 'intercom',
        label: isIntercomVisible ? 'Hide Intercom' : 'Contact us',
        onClick: trackingEventsWrapper(isIntercomVisible ? hideIntercom : showIntercom, 'trackCanvasControlHelpMenuResource', {
          resource: 'Intercom',
        }),
      },
    ],
    [isIntercomVisible]
  );
};
