import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, MenuTypes, TippyTooltip, Utils as UIUtils } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { useRouteMatch } from 'react-router-dom';

import * as GPT from '@/components/GPT';
import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { PRIVATE_LLM_MODELS } from '@/config';
import { CMSRoute, Path } from '@/config/routes';
import { BOOK_DEMO_LINK, DISCORD_COMMUNITY_LINK, DOCS_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import { Permission } from '@/constants/permissions';
import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import * as Transcript from '@/ducks/transcript';
import { useFeature } from '@/hooks/feature';
import { HotkeyItem, useHotkeyList } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import * as ModalsV2 from '@/ModalsV2';
import { useCMSRoute } from '@/pages/AssistantCMS/hooks/cms-route.hook';
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
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
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
  [CanvasOptionType.KNOWLEDGE_BASE]: [Path.PROJECT_KNOWLEDGE_BASE],
};

interface SidebarHotkeyMenuItem extends SidebarIconMenuItem {
  id: string;
  label: string;
  onAction: VoidFunction;
}

const isSidebarHotkeyMenuItem = (item: SidebarHotkeyMenuItem | SidebarIconMenuItem): item is SidebarHotkeyMenuItem => !item.divider;

export const useCanvasMenuOptionsAndHotkeys = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const tokenPurchaseModal = ModalsV2.useModal(ModalsV2.Tokens.Purchase);
  const aiFeature = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);
  const kbCMS = useFeature(Realtime.FeatureFlag.CMS_KB);
  const knowledgeBase = useKnowledgeBase();
  const { redirectToActiveRoute: goToActiveCMSRoute } = useCMSRoute();

  const match = useRouteMatch();
  const hasUnreadTranscripts = useSelector(Transcript.hasUnreadTranscriptsSelector);

  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);
  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToKnowledgeBase = useDispatch(Router.goToCurrentKnowledgeBase);
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
      ...UIUtils.array.conditionalItem(knowledgeBase && canEditProject, {
        id: Utils.id.cuid.slug(),
        icon: 'brain' as const,
        value: CanvasOptionType.KNOWLEDGE_BASE,
        label: 'Knowledge Base',
        onAction: () => (kbCMS.isEnabled ? goToCMSResource(CMSRoute.KNOWLEDGE_BASE) : goToKnowledgeBase()),
      }),
      ...UIUtils.array.conditionalItem((nluManager.isEnabled && canViewNluManager) || (v2CMS.isEnabled && canEditProject), {
        id: Utils.id.cuid.slug(),
        icon: 'systemModel' as const,
        value: CanvasOptionType.NLU_MANAGER,
        label: v2CMS.isEnabled ? 'Content' : 'NLU Manager',
        onAction: () => (v2CMS.isEnabled ? goToActiveCMSRoute() : goToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV)),
      }),
      ...UIUtils.array.conditionalItem(canViewConversations, {
        id: Utils.id.cuid.slug(),
        icon: 'systemTranscripts' as const,
        value: CanvasOptionType.CONVERSATION,
        label: 'Transcripts',
        onAction: goToCurrentTranscript,
        withBadge: hasUnreadTranscripts,
      }),
      {
        id: Utils.id.cuid.slug(),
        icon: 'measure' as const,
        value: CanvasOptionType.ANALYTICS_DASHBOARD,
        label: 'Analytics',
        onAction: goToCurrentAnalytics,
      },
      ...UIUtils.array.conditionalItem(canEditProject, {
        value: Utils.id.cuid.slug(),
        divider: true,
      }),
      ...UIUtils.array.conditionalItem((canEditProject || viewerAPIKeyAccess.isEnabled) && !disableIntegration.isEnabled && !hideExports.isEnabled, {
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
  }, [nluManager.isEnabled, canViewNluManager, canViewConversations, canEditProject, disableIntegration.isEnabled, v2CMS.isEnabled, knowledgeBase]);

  const aiUsage = GPT.useAIUsage();
  const aiUsageTooltip = GPT.useAIUsageTooltip({ onOpenModal: () => tokenPurchaseModal.openVoid({ workspaceID }) });

  const footerOptions: Nullable<SidebarIconMenuItem>[] = [
    aiFeature.isEnabled
      ? {
          icon: 'aiSmall',
          value: CanvasOptionType.AI_SETTINGS,
          status: aiUsage.isOn ? 'On' : 'Off',
          tooltip: PRIVATE_LLM_MODELS.size ? undefined : aiUsageTooltip,
          cursor: 'default',
          content: PRIVATE_LLM_MODELS.size ? undefined : (
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
      onClick: trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DISCORD_COMMUNITY_LINK), 'trackCanvasControlHelpMenuResource', {
        resource: 'Forum',
      }),
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
