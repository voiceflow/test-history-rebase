import * as Realtime from '@voiceflow/realtime-sdk';
import { useMemo } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import { useKnowledgeBase } from '@/components/GPT';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useFeature } from '@/hooks/feature';
import { HotkeyItem, useHotkeyList } from '@/hooks/hotkeys';
import { useGetResolvedPath } from '@/hooks/navigation.hook';
import { usePermission } from '@/hooks/permission';
import { conditionalArrayItems } from '@/utils/array.util';

import { IAssistantMenuItem } from './AssistantMenu.interface';

export const useAssistantMenuItems = () => {
  const location = useLocation();
  const knowledgeBase = useKnowledgeBase();

  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const CMSKB = useFeature(Realtime.FeatureFlag.CMS_KB);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return useMemo<IAssistantMenuItem[]>(() => {
    const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

    return [
      {
        path: Path.PROJECT_DOMAIN,
        isActive: isItemActive(Path.PROJECT_DOMAIN),
        iconName: 'Designer',
      },

      ...conditionalArrayItems<IAssistantMenuItem>(knowledgeBase && !CMSKB.isEnabled, {
        path: Path.PROJECT_KNOWLEDGE_BASE,
        isActive: isItemActive(Path.PROJECT_KNOWLEDGE_BASE),
        iconName: 'Brain',
      }),

      {
        path: Path.PROJECT_CMS,
        isActive: isItemActive(Path.PROJECT_CMS),
        iconName: 'Content',
      },

      ...conditionalArrayItems<IAssistantMenuItem>(canViewConversations, {
        path: Path.CONVERSATIONS,
        isActive: isItemActive(Path.CONVERSATIONS),
        iconName: 'Transcripts',
      }),

      {
        path: Path.PROJECT_ANALYTICS,
        isActive: isItemActive(Path.PROJECT_ANALYTICS),
        iconName: 'Measure',
      },

      ...conditionalArrayItems<IAssistantMenuItem>(canEditAPIKey || viewerAPIKeyAccess.isEnabled, {
        path: Path.PUBLISH_API,
        isActive: isItemActive(Path.PUBLISH_API),
        iconName: 'Api',
      }),

      ...conditionalArrayItems<IAssistantMenuItem>(canEditProject, {
        path: Path.PROJECT_SETTINGS,
        isActive: isItemActive(Path.PROJECT_SETTINGS),
        iconName: 'Settings',
      }),
    ];
  }, [location, knowledgeBase, CMSKB.isEnabled, canViewConversations, canEditAPIKey, viewerAPIKeyAccess.isEnabled, canEditProject]);
};

export const useAssistantMenuHotkeys = (items: IAssistantMenuItem[]) => {
  const history = useHistory();
  const getResolvedPath = useGetResolvedPath();

  const hotkeys = useMemo(
    () =>
      items.map<HotkeyItem>((item, index) => ({
        hotkey: String(index + 1),
        callback: () => history.push(getResolvedPath(item.path)),
        preventDefault: true,
      })),
    [items, history.push]
  );

  useHotkeyList(hotkeys, [hotkeys, getResolvedPath]);
};
