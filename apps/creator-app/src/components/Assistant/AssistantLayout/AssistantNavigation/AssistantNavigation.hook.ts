import { IconName } from '@voiceflow/icons';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useMemo } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Project, Router, Session } from '@/ducks';
import { useOnAssistantCopyCloneLink, useOnAssistantDuplicate } from '@/hooks/assistant.hook';
import { useFeature } from '@/hooks/feature';
import { HotkeyItem, useHotkeyList } from '@/hooks/hotkeys';
import { useModal } from '@/hooks/modal.hook';
import { useGetResolvedPath } from '@/hooks/navigation.hook';
import { useIsLockedProjectViewer, useIsPreviewer, usePermission } from '@/hooks/permission';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { conditionalArrayItems } from '@/utils/array.util';

import { IAssistantNavigationItem } from './AssistantNavigation.interface';

type NavigationLogoItem =
  | { key: string; divider: true }
  | {
      key: string;
      label: React.ReactNode;
      onClick: (options: { export: VoidFunction; sharePrototype: VoidFunction }) => void;
      iconName: IconName;
    };

export const useAssistantNavigationLogoItems = (): NavigationLogoItem[] => {
  const isPreviewer = useIsPreviewer();
  const isLockedProjectViewer = useIsLockedProjectViewer();

  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const [canExportModel] = usePermission(Permission.FEATURE_EXPORT_MODEL);
  const [canSharePrototype] = usePermission(Permission.PROJECT_PROTOTYPE_SHARE);
  const [canManageProjects] = usePermission(Permission.WORKSPACE_PROJECTS_MANAGE);
  const [canAddCollaborators] = usePermission(Permission.WORKSPACE_MEMBER_ADD);

  const platform = useSelector(Project.active.platformSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);

  const goToDashboard = useDispatch(Router.goToDashboard);

  const onDuplicate = useOnAssistantDuplicate(projectID);
  const onCopyCloneLink = useOnAssistantCopyCloneLink(projectID);

  const platformConfig = Platform.Config.get(platform);
  const isProjectLocked = isLockedProjectViewer || platformConfig.isDeprecated;
  const isPreviewerOrLockedViewer = isPreviewer || isProjectLocked;

  const projectMembersModal = useModal(Modals.Project.Members);

  const withExport = !isPreviewerOrLockedViewer && canExportModel;
  const withSharePrototype = !isPreviewerOrLockedViewer && canSharePrototype && !hideExports.isEnabled;
  const withDuplicateOption = !isPreviewerOrLockedViewer && canManageProjects;
  const withInviteCollaborators = !isPreviewerOrLockedViewer && canAddCollaborators && !!projectID;
  const withCopyCloneLinkOption = !isPreviewerOrLockedViewer && canManageProjects;

  return [
    { key: 'back', label: 'Back to dashboard', iconName: 'ArrowLeft', onClick: () => goToDashboard() },
    ...conditionalArrayItems<NavigationLogoItem>(withSharePrototype || withInviteCollaborators || withExport, {
      key: 'divider-1',
      divider: true,
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withSharePrototype, {
      key: 'share',
      label: 'Share prototype',
      onClick: (props) => props.sharePrototype(),
      iconName: 'SharePrototype',
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withInviteCollaborators, {
      key: 'invite',
      label: 'Invite collaborators',
      onClick: () => projectMembersModal.openVoid({ projectID: projectID! }),
      iconName: 'Collaborators',
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withExport, {
      key: 'export',
      label: 'Export as...',
      onClick: (props) => props.export(),
      iconName: 'Export',
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withDuplicateOption || withCopyCloneLinkOption, {
      key: 'divider-2',
      divider: true,
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withDuplicateOption, {
      key: 'duplicate',
      label: 'Duplicate agent',
      onClick: onDuplicate,
      iconName: 'Duplicate',
    }),
    ...conditionalArrayItems<NavigationLogoItem>(withCopyCloneLinkOption, {
      key: 'copy-clone-link',
      label: 'Copy clone link',
      onClick: onCopyCloneLink,
      iconName: 'Import',
    }),
  ];
};

export const useAssistantNavigationItems = () => {
  const location = useLocation();

  const [canEditAPIKey] = usePermission(Permission.API_KEY_UPDATE);
  const [canEditProject] = usePermission(Permission.PROJECT_UPDATE);
  const [canViewConversations] = usePermission(Permission.PROJECT_TRANSCRIPT_READ);

  const diagramID = useSelector(Session.activeDiagramIDSelector) ?? '';

  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return useMemo<IAssistantNavigationItem[]>(() => {
    const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

    return [
      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_CMS,
        testID: 'cms',
        hotkey: '',
        isActive: isItemActive(Path.PROJECT_CMS),
        iconName: 'Designer',
        tooltipLabel: 'Content',
      }),
      ...conditionalArrayItems<IAssistantNavigationItem>(canViewConversations, {
        path: Path.PROJECT_CONVERSATIONS,
        testID: 'transcripts',
        hotkey: '',
        isActive: isItemActive(Path.PROJECT_CONVERSATIONS),
        iconName: 'Transcripts',
        tooltipLabel: 'Transcripts',
      }),
      {
        path: Path.PROJECT_ANALYTICS,
        testID: 'analytics',
        isActive: isItemActive(Path.PROJECT_ANALYTICS),
        iconName: 'Measure' as const,
        tooltipLabel: 'Analytics',
      },
      ...conditionalArrayItems<IAssistantNavigationItem>(canEditAPIKey || viewerAPIKeyAccess.isEnabled, {
        path: Path.PUBLISH_API,
        testID: 'publishing',
        hotkey: '',
        isActive: isItemActive(Path.PUBLISH),
        iconName: 'Api',
        tooltipLabel: 'Integration',
      }),

      ...conditionalArrayItems<IAssistantNavigationItem>(canEditProject, {
        path: Path.PROJECT_SETTINGS,
        testID: 'settings',
        hotkey: '',
        isActive: isItemActive(Path.PROJECT_SETTINGS),
        iconName: 'Settings',
        tooltipLabel: 'Settings',
      }),
    ].map<IAssistantNavigationItem>((item, index) => ({ ...item, hotkey: String(index + 1) }));
  }, [location.pathname, canViewConversations, canEditAPIKey, viewerAPIKeyAccess.isEnabled, canEditProject, diagramID]);
};

export const useAssistantNavigationHotkeys = (items: IAssistantNavigationItem[]) => {
  const history = useHistory();
  const getResolvedPath = useGetResolvedPath();

  const hotkeys = useMemo(
    () =>
      items.map<HotkeyItem>((item) => ({
        hotkey: item.hotkey,
        callback: () => history.push(getResolvedPath(item.path, item.params)),
        preventDefault: true,
      })),
    [items, history.push]
  );

  useHotkeyList(hotkeys, [hotkeys, getResolvedPath]);
};
