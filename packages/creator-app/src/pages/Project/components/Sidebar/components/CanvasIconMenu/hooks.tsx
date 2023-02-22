import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, MenuTypes, TippyTooltip } from '@voiceflow/ui';
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
import { useDispatch, useFeature, useHotKeys, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { SettingSections } from '@/pages/Settings/constants';
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
  [CanvasOptionType.ANALYTICS_DASHBOARD]: [Path.ANALYTICS_DASHBOARD],
};

export const useCanvasMenuOptionsAndHotkeys = () => {
  const aiFeature = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const analyticsDashboard = useFeature(Realtime.FeatureFlag.ANALYTICS_DASHBOARD);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

  if (analyticsDashboard.isEnabled && !nluManager.isEnabled) {
    // TODO(jonahsnider): Temporary solution - see https://voiceflowhq.slack.com/archives/C046QQQAX18/p1670018716569129
    throw new Error(`${Realtime.FeatureFlag.ANALYTICS_DASHBOARD} feature flag requires ${Realtime.FeatureFlag.NLU_MANAGER} to be enabled too`);
  }

  const match = useRouteMatch();
  const hasUnreadTranscripts = useSelector(Transcript.hasUnreadTranscriptsSelector);

  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);
  const goToCurrentSettings = useDispatch(Router.goToCurrentSettings);
  const goToCurrentAnalytics = useDispatch(Router.goToCurrentAnalytics);
  const goToCurrentTranscript = useDispatch(Router.goToCurrentTranscript);

  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);
  const [canViewNluManager] = usePermission(Permission.NLU_VIEW_MANAGER);

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
    disable: !nluManager.isEnabled || !canViewNluManager,
    preventDefault: true,
  });
  useHotKeys(Hotkey.CONVERSATION_PAGE, goToCurrentTranscript, {
    disable: !nluManager.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.ANALYTICS_PAGE, goToCurrentAnalytics, {
    disable: !nluManager.isEnabled || !analyticsDashboard.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.INTEGRATION_PAGE, goToCurrentPublish, {
    disable: disableIntegration || !nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });
  useHotKeys(Hotkey.SETTINGS_PAGE, () => goToCurrentSettings(), {
    disable: !nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });

  useHotKeys(Hotkey.CONVERSATION_PAGE_LEGACY, goToCurrentTranscript, {
    disable: nluManager.isEnabled,
    preventDefault: true,
  });
  useHotKeys(Hotkey.INTEGRATION_PAGE_LEGACY, goToCurrentPublish, {
    disable: nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });
  useHotKeys(Hotkey.SETTINGS_PAGE_LEGACY, () => goToCurrentSettings(), {
    disable: nluManager.isEnabled || !canEditProject,
    preventDefault: true,
  });

  const options: Nullable<SidebarIconMenuItem>[] = [
    {
      icon: 'systemLayers',
      value: CanvasOptionType.DESIGNER,
      tooltip: {
        content: <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.DESIGN_PAGE]}>Designer</TippyTooltip.WithHotkey>,
      },
      onClick: goToCurrentCanvas,
    },
    !nluManager.isEnabled || !canViewNluManager
      ? null
      : {
          icon: 'systemModel',
          value: CanvasOptionType.NLU_MANAGER,
          tooltip: {
            content: <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.NLU_MANAGER_PAGE]}>NLU Manager</TippyTooltip.WithHotkey>,
          },
          onClick: () => goToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV),
        },
    !canViewConversations
      ? null
      : {
          icon: 'systemTranscripts',
          value: CanvasOptionType.CONVERSATION,
          tooltip: {
            content: (
              <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.CONVERSATION_PAGE : Hotkey.CONVERSATION_PAGE_LEGACY]}>
                Transcripts
              </TippyTooltip.WithHotkey>
            ),
          },
          onClick: goToCurrentTranscript,
          withBadge: hasUnreadTranscripts,
        },
    nluManager.isEnabled && analyticsDashboard.isEnabled
      ? {
          icon: 'measure',
          value: CanvasOptionType.ANALYTICS_DASHBOARD,
          tooltip: {
            content: <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.ANALYTICS_PAGE]}>Analytics</TippyTooltip.WithHotkey>,
          },
          onClick: goToCurrentAnalytics,
        }
      : null,
    !canEditProject || disableIntegration
      ? null
      : {
          icon: 'integrations',
          value: CanvasOptionType.INTEGRATION,
          tooltip: {
            content: (
              <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.INTEGRATION_PAGE : Hotkey.INTEGRATION_PAGE_LEGACY]}>
                Integration
              </TippyTooltip.WithHotkey>
            ),
          },
          onClick: goToCurrentPublish,
        },
    !canEditProject
      ? null
      : {
          icon: 'systemSettings',
          value: CanvasOptionType.SETTINGS,
          tooltip: {
            content: (
              <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[nluManager.isEnabled ? Hotkey.SETTINGS_PAGE : Hotkey.SETTINGS_PAGE_LEGACY]}>
                Settings
              </TippyTooltip.WithHotkey>
            ),
          },
          onClick: () => goToCurrentSettings(),
        },
  ];

  const aiUsage = GPT.useAIUsage();
  const aiUsageTooltip = GPT.useAIUsageTooltip();

  const footerOptions: Nullable<SidebarIconMenuItem>[] = [
    aiFeature.isEnabled
      ? {
          icon: 'ai',
          value: CanvasOptionType.AI_SETTINGS,
          status: aiUsage.isOn ? 'On' : 'Off',
          tooltip: aiUsageTooltip,
          content: (
            <Box.FlexCenter mt={6}>
              <GPT.AIUsageProgress width={36} />
            </Box.FlexCenter>
          ),
          onClick: () => canEditProject && goToCurrentSettings({ state: { section: SettingSections.AI_ASSISTANT } }),
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
