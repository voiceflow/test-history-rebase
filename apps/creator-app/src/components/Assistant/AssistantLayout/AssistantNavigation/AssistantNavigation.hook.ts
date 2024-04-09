import * as Realtime from '@voiceflow/realtime-sdk';
import { useMemo } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Session } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { HotkeyItem, useHotkeyList } from '@/hooks/hotkeys';
import { useGetResolvedPath } from '@/hooks/navigation.hook';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { conditionalArrayItems } from '@/utils/array.util';

import { IAssistantNavigationItem } from './AssistantNavigation.interface';

export const useAssistantNavigationItems = () => {
  const location = useLocation();

  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canViewConversations] = usePermission(Permission.VIEW_CONVERSATIONS);

  const domainID = useSelector(Session.activeDomainIDSelector) ?? '';
  const diagramID = useSelector(Session.activeDiagramIDSelector) ?? '';

  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return useMemo<IAssistantNavigationItem[]>(() => {
    const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

    // eslint-disable-next-line no-nested-ternary
    const designerPath = cmsWorkflows.isEnabled ? Path.PROJECT_CANVAS : domainID && diagramID ? Path.DOMAIN_CANVAS : Path.PROJECT_DOMAIN;

    return [
      ...conditionalArrayItems<IAssistantNavigationItem>(!cmsWorkflows.isEnabled, {
        path: designerPath,
        testID: 'designer',
        params: domainID && diagramID ? { domainID, diagramID } : {},
        isActive: isItemActive(designerPath),
        iconName: 'Designer',
      }),
      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_CMS,
        testID: 'cms',
        isActive: isItemActive(Path.PROJECT_CMS),
        iconName: 'Content',
      }),
      ...conditionalArrayItems<IAssistantNavigationItem>(canViewConversations, {
        path: Path.PROJECT_CONVERSATIONS,
        testID: 'transcripts',
        isActive: isItemActive(Path.PROJECT_CONVERSATIONS),
        iconName: 'Transcripts',
      }),
      {
        path: Path.PROJECT_ANALYTICS,
        testID: 'analytics',
        isActive: isItemActive(Path.PROJECT_ANALYTICS),
        iconName: 'Measure',
      },

      ...conditionalArrayItems<IAssistantNavigationItem>(canEditAPIKey || viewerAPIKeyAccess.isEnabled, {
        path: Path.PUBLISH_API,
        testID: 'publishing',
        isActive: isItemActive(Path.PUBLISH_API),
        iconName: 'Api',
      }),

      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_SETTINGS,
        testID: 'settings',
        isActive: isItemActive(Path.PROJECT_SETTINGS),
        iconName: 'Settings',
      }),
    ];
  }, [location.pathname, canViewConversations, canEditAPIKey, viewerAPIKeyAccess.isEnabled, canEditProject, domainID, diagramID]);
};

export const useAssistantNavigationHotkeys = (items: IAssistantNavigationItem[]) => {
  const history = useHistory();
  const getResolvedPath = useGetResolvedPath();

  const hotkeys = useMemo(
    () =>
      items.map<HotkeyItem>((item, index) => ({
        hotkey: String(index + 1),
        callback: () => history.push(getResolvedPath(item.path, item.params)),
        preventDefault: true,
      })),
    [items, history.push]
  );

  useHotkeyList(hotkeys, [hotkeys, getResolvedPath]);
};
