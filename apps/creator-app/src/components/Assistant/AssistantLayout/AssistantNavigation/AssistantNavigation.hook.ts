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

import { IAssistantNavigationItem } from './AssistantNavigation.interface';

export const useAssistantNavigationItems = () => {
  const location = useLocation();
  const knowledgeBase = useKnowledgeBase();

  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return useMemo<IAssistantNavigationItem[]>(() => {
    const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

    return [
      {
        path: Path.PROJECT_DOMAIN,
        isActive: isItemActive(Path.PROJECT_DOMAIN),
        iconName: 'Designer',
      },
      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_CMS,
        isActive: isItemActive(Path.PROJECT_CMS),
        iconName: 'Content',
      }),
      ...conditionalArrayItems<IAssistantNavigationItem>(canViewConversations, {
        path: Path.CONVERSATIONS,
        isActive: isItemActive(Path.CONVERSATIONS),
        iconName: 'Transcripts',
      }),
      {
        path: Path.PROJECT_ANALYTICS,
        isActive: isItemActive(Path.PROJECT_ANALYTICS),
        iconName: 'Measure',
      },

      ...conditionalArrayItems<IAssistantNavigationItem>(canEditAPIKey || viewerAPIKeyAccess.isEnabled, {
        path: Path.PUBLISH_API,
        isActive: isItemActive(Path.PUBLISH_API),
        iconName: 'Api',
      }),

      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_SETTINGS,
        isActive: isItemActive(Path.PROJECT_SETTINGS),
        iconName: 'Settings',
      }),
    ];
  }, [location, knowledgeBase, canViewConversations, canEditAPIKey, viewerAPIKeyAccess.isEnabled, canEditProject]);
};

export const useAssistantNavigationHotkeys = (items: IAssistantNavigationItem[]) => {
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
