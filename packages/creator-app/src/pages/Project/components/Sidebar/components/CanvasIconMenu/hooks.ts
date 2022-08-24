import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuTypes } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { useRouteMatch } from 'react-router-dom';

import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, DOCS_LINK, FORUM_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useFeature, useHotKeys, usePermission, useSelector, useTrackingEvents } from '@/hooks';
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
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const match = useRouteMatch();
  const hasUnreadTranscripts = useSelector(Transcript.hasUnreadTranscriptsSelector);

  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);
  const goToCurrentSettings = useDispatch(Router.goToCurrentSettings);
  const goToCurrentTranscript = useDispatch(Router.goToCurrentTranscript);

  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const helpButtonRef = React.useRef<HTMLDivElement | null>(null);

  const [helpOpened, toggleHelpOpened] = useDismissable(false, { ref: helpButtonRef });

  const activeValue = React.useMemo(() => {
    if (helpOpened) return CanvasOptionType.HELP;

    if (!match) return CanvasOptionType.DESIGNER;

    const matchedOption = (Object.entries(RouteCanvasOptionMap) as [CanvasOptionType, string[]][]).find(([, paths]) =>
      paths.includes(match.path)
    )?.[0];

    return matchedOption ?? CanvasOptionType.DESIGNER;
  }, [match, helpOpened]);

  useHotKeys(Hotkey.DESIGN_PAGE, goToCurrentCanvas, { preventDefault: true });
  useHotKeys(Hotkey.NLU_MANAGER_PAGE, () => goToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV), {
    disable: !nluManager.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.CONVERSATION_PAGE, goToCurrentTranscript, {
    disable: !nluManager.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.INTEGRATION_PAGE, goToCurrentPublish, {
    disable: !nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });
  useHotKeys(Hotkey.SETTINGS_PAGE, goToCurrentSettings, {
    disable: !nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });

  useHotKeys(Hotkey.CONVERSATION_PAGE_LEGACY, goToCurrentTranscript, {
    disable: !!nluManager.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.INTEGRATION_PAGE_LEGACY, goToCurrentPublish, {
    disable: nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });
  useHotKeys(Hotkey.SETTINGS_PAGE_LEGACY, goToCurrentSettings, {
    disable: nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });

  const options: Nullable<SidebarIconMenuItem>[] = [
    {
      icon: 'systemLayers',
      value: CanvasOptionType.DESIGNER,
      tooltip: { title: 'Designer', hotkey: HOTKEY_LABEL_MAP[Hotkey.DESIGN_PAGE] },
      onClick: goToCurrentCanvas,
    },
    !nluManager.isEnabled
      ? null
      : {
          icon: 'systemModel',
          value: CanvasOptionType.NLU_MANAGER,
          tooltip: { title: 'NLU Manager', hotkey: HOTKEY_LABEL_MAP[Hotkey.NLU_MANAGER_PAGE] },
          onClick: () => goToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV),
        },
    !canViewConversations
      ? null
      : {
          icon: 'systemTranscripts',
          value: CanvasOptionType.CONVERSATION,
          tooltip: {
            title: 'Transcripts',
            hotkey: HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.CONVERSATION_PAGE : Hotkey.CONVERSATION_PAGE_LEGACY],
          },
          onClick: goToCurrentTranscript,
          withBadge: hasUnreadTranscripts,
        },
    !canEditProject
      ? null
      : {
          icon: 'integrations',
          value: CanvasOptionType.INTEGRATION,
          tooltip: {
            title: 'Integration',
            hotkey: HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.INTEGRATION_PAGE : Hotkey.INTEGRATION_PAGE_LEGACY],
          },
          onClick: goToCurrentPublish,
        },
    !canEditProject
      ? null
      : {
          icon: 'systemSettings',
          value: CanvasOptionType.SETTINGS,
          tooltip: {
            title: 'Project Settings',
            hotkey: HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.SETTINGS_PAGE : Hotkey.SETTINGS_PAGE_LEGACY],
          },
          onClick: goToCurrentSettings,
        },
  ];

  const footerOptions: Nullable<SidebarIconMenuItem>[] = [
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
  ];

  return {
    options,
    helpOpened,
    activeValue,
    helpButtonRef,
    footerOptions,
  };
};

export const useHelpOptions = (): MenuTypes.OptionWithoutValue[] => {
  const isIntercomVisible = useSelector(Session.isIntercomVisibleSelector);

  const showIntercom = useDispatch(Session.showIntercom);
  const hideIntercom = useDispatch(Session.hideIntercom);

  const [, trackingEventsWrapper] = useTrackingEvents();

  return [
    {
      key: 'docs',
      label: 'Documentation',
      onClick: trackingEventsWrapper(() => window.open(DOCS_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', { resource: 'Docs' }),
    },
    {
      key: 'videos',
      label: 'Video tutorials',
      onClick: trackingEventsWrapper(() => window.open(YOUTUBE_CHANNEL_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', { resource: 'Videos' }),
    },
    {
      key: 'forum',
      label: 'Community',
      onClick: trackingEventsWrapper(() => window.open(FORUM_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', { resource: 'Forum' }),
    },
    { key: 'divider', label: 'Divider', divider: true },
    {
      key: 'demo',
      label: 'Book a demo',
      onClick: trackingEventsWrapper(() => window.open(BOOK_DEMO_LINK, '_blank'), 'trackCanvasControlHelpMenuResource', { resource: 'Demo' }),
    },
    {
      key: 'intercom',
      label: isIntercomVisible ? 'Hide Intercom' : 'Contact us',
      onClick: trackingEventsWrapper(isIntercomVisible ? hideIntercom : showIntercom, 'trackCanvasControlHelpMenuResource', { resource: 'Intercom' }),
    },
  ];
};
