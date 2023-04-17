import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, MenuTypes, TippyTooltip, Utils as UIUtils } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { useRouteMatch } from 'react-router-dom';

import * as GPT from '@/components/GPT';
import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, DOCS_LINK, FORUM_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import { Permission } from '@/constants/permissions';
import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';
import * as Router from '@/ducks/router';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import * as Transcript from '@/ducks/transcript';
import { useFeature } from '@/hooks/feature';
import { HotkeyItem, useHotkeyList } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export enum CanvasOptionType {
  HELP = 'HELP',
  SETTINGS = 'SETTINGS',
  DESIGNER = 'DESIGNER',
  INTEGRATION = 'INTEGRATION',
  AI_SETTINGS = 'AI_SETTINGS',
  NLU_MANAGER = 'NLU_MANAGER',
  CONVERSATION = 'CONVERSATION',
  ANALYTICS_DASHBOARD = 'ANALYTICS_DASHBOARD',
}

const RouteCanvasOptionMap: Record<CanvasOptionType, string[]> = {
  [CanvasOptionType.HELP]: [],
  [CanvasOptionType.DESIGNER]: [],
  [CanvasOptionType.SETTINGS]: [Path.PROJECT_SETTINGS],
  [CanvasOptionType.AI_SETTINGS]: [],
  [CanvasOptionType.INTEGRATION]: [Path.PROJECT_PUBLISH],
  [CanvasOptionType.CONVERSATION]: [Path.CONVERSATIONS],
  [CanvasOptionType.NLU_MANAGER]: [Path.NLU_MANAGER],
  [CanvasOptionType.ANALYTICS_DASHBOARD]: [Path.PROJECT_ANALYTICS],
};

interface SidebarHotkeyMenuItem extends SidebarIconMenuItem {
  id: string;
  label: string;
  onAction: VoidFunction;
}

const isSidebarHotkeyMenuItem = (item: SidebarHotkeyMenuItem | SidebarIconMenuItem): item is SidebarHotkeyMenuItem => !item.divider;

export const useCanvasMenuOptionsAndHotkeys = () => {
  const aiFeature = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const analyticsDashboard = useFeature(Realtime.FeatureFlag.ANALYTICS_DASHBOARD);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION);

  const match = useRouteMatch();
  const hasUnreadTranscripts = useSelector(Transcript.hasUnreadTranscriptsSelector);

  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);
  const goToCurrentSettings = useDispatch(Router.goToCurrentSettings);
  const goToCurrentAnalytics = useDispatch(Router.goToCurrentAnalytics);
  const goToCurrentTranscript = useDispatch(Router.goToCurrentTranscript);

  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canViewNluManager] = usePermission(Permission.NLU_VIEW_MANAGER);
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

  const { hotkeys, options } = React.useMemo(() => {
    const items: (SidebarHotkeyMenuItem | SidebarIconMenuItem)[] = [
      {
        id: Utils.id.cuid.slug(),
        icon: 'systemLayers',
        value: CanvasOptionType.DESIGNER,
        label: 'Designer',
        onAction: goToCurrentCanvas,
      },
      ...UIUtils.array.conditionalItem(nluManager.isEnabled && canViewNluManager, {
        id: Utils.id.cuid.slug(),
        icon: 'systemModel' as const,
        value: CanvasOptionType.NLU_MANAGER,
        label: 'NLU Manager',
        onAction: () => goToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV),
      }),
      ...UIUtils.array.conditionalItem(canViewConversations, {
        id: Utils.id.cuid.slug(),
        icon: 'systemTranscripts' as const,
        value: CanvasOptionType.CONVERSATION,
        label: 'Transcripts',
        onAction: goToCurrentTranscript,
        withBadge: hasUnreadTranscripts,
      }),
      ...UIUtils.array.conditionalItem(analyticsDashboard.isEnabled, {
        id: Utils.id.cuid.slug(),
        icon: 'measure' as const,
        value: CanvasOptionType.ANALYTICS_DASHBOARD,
        label: 'Analytics',
        onAction: goToCurrentAnalytics,
      }),
      ...UIUtils.array.conditionalItem(canEditProject, {
        id: Utils.id.cuid.slug(),
        value: 'divider',
        divider: true,
      }),
      ...UIUtils.array.conditionalItem(canEditProject && !disableIntegration.isEnabled, {
        id: Utils.id.cuid.slug(),
        icon: 'integrations' as const,
        value: CanvasOptionType.INTEGRATION,
        label: 'Integration',
        onAction: goToCurrentPublish,
      }),
      ...UIUtils.array.conditionalItem(canEditProject, {
        id: Utils.id.cuid.slug(),
        icon: 'systemSettings' as const,
        value: CanvasOptionType.SETTINGS,
        label: 'Settings',
        onAction: () => goToCurrentSettings(),
      }),
    ];

    const hotkeys = items.filter(isSidebarHotkeyMenuItem).map<HotkeyItem>(({ onAction }, index) => ({
      hotkey: String(index + 1),
      callback: onAction,
      preventDefault: true,
    }));

    let hotkeyIndex = 0;
    const options = items.map((item) => {
      const isHotkeyItem = isSidebarHotkeyMenuItem(item);

      if (isHotkeyItem) {
        hotkeyIndex += 1;
      }

      return {
        icon: item.icon,
        value: item.value,
        tooltip: isHotkeyItem ? { content: <TippyTooltip.WithHotkey hotkey={String(hotkeyIndex)}>{item.label}</TippyTooltip.WithHotkey> } : undefined,
        onClick: isHotkeyItem ? item.onAction : undefined,
        divider: item.divider,
      };
    });

    return {
      hotkeys,
      options,
    };
  }, [nluManager.isEnabled, canViewNluManager, canViewConversations, analyticsDashboard.isEnabled, canEditProject, disableIntegration.isEnabled]);

  const aiUsage = GPT.useAIUsage();
  const aiUsageTooltip = GPT.useAIUsageTooltip();

  const footerOptions: Nullable<SidebarIconMenuItem>[] = [
    aiFeature.isEnabled
      ? {
          icon: 'aiSmall',
          value: CanvasOptionType.AI_SETTINGS,
          status: aiUsage.isOn ? 'On' : 'Off',
          tooltip: aiUsageTooltip,
          cursor: 'default',
          content: (
            <Box.FlexCenter mt={6}>
              <GPT.AIUsageProgress width={36} />
            </Box.FlexCenter>
          ),
        }
      : null,

    {
      icon: 'info',
      value: CanvasOptionType.HELP,
      small: true,
      tooltip: { content: 'Help' },
      onClick: (event) => {
        helpButtonRef.current = event.currentTarget;
        toggleHelpOpened();
      },
    },
  ];

  useHotkeyList(hotkeys, [hotkeys]);

  return {
    options,
    helpOpened,
    activeValue,
    helpButtonRef,
    footerOptions,
  };
};

export const useHelpOptions = (): MenuTypes.OptionWithoutValue[] => {
  const [, trackingEventsWrapper] = useTrackingEvents();

  const voiceflowAssistantVisibility = React.useContext(VoiceflowAssistantVisibilityContext);

  return [
    {
      key: 'docs',
      label: 'Documentation',
      onClick: trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DOCS_LINK), 'trackCanvasControlHelpMenuResource', { resource: 'Docs' }),
    },
    {
      key: 'videos',
      label: 'Video tutorials',
      onClick: trackingEventsWrapper(onOpenInternalURLInANewTabFactory(YOUTUBE_CHANNEL_LINK), 'trackCanvasControlHelpMenuResource', {
        resource: 'Videos',
      }),
    },
    {
      key: 'forum',
      label: 'Community',
      onClick: trackingEventsWrapper(onOpenInternalURLInANewTabFactory(FORUM_LINK), 'trackCanvasControlHelpMenuResource', { resource: 'Forum' }),
    },
    {
      key: 'chatbot',
      label: voiceflowAssistantVisibility?.isEnabled ? 'Hide chatbot' : 'Show chatbot',
      onClick: () => voiceflowAssistantVisibility?.onToggleEnabled(),
    },
    { key: 'divider', label: 'Divider', divider: true },
    {
      key: 'demo',
      label: 'Book a demo',
      onClick: trackingEventsWrapper(onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK), 'trackCanvasControlHelpMenuResource', { resource: 'Demo' }),
    },
  ];
};
