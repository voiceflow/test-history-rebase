import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
import { useAlexaProjectSettings } from '@/hooks/project';
import { useSelector } from '@/hooks/redux';

import CanvasIconMenu from './CanvasIconMenu';

interface MenuOption {
  to: string;
  title: string;
  icon: SvgIconTypes.Icon;
}

const IntegrationsSidebar: React.FC = () => {
  const meta = useSelector(ProjectV2.active.metaSelector);

  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const [canExportCode] = usePermission(Permission.CODE_EXPORT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const projectAPIImprovements = useFeature(Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS).isEnabled;
  const canUseAlexaSettings = useAlexaProjectSettings();

  const goToActiveProjectAPIPublish = useDispatch(Router.goToActiveProjectAPIPublish);

  const { name: title } = Platform.Config.get(meta.platform);

  const {
    icon: { name: icon },
  } = Platform.Config.getTypeConfig(meta);

  const publishPaths = React.useMemo<MenuOption[]>(() => {
    if (!canEditProject) return [];

    switch (meta.platform) {
      case Platform.Constants.PlatformType.ALEXA:
        return canUseAlexaSettings ? [{ to: generatePath(Path.PUBLISH_ALEXA, { versionID }), title, icon }] : [];
      case Platform.Constants.PlatformType.GOOGLE:
        return [{ to: generatePath(Path.PUBLISH_GOOGLE, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.DIALOGFLOW_ES:
        return [{ to: generatePath(Path.PUBLISH_DIALOGFLOW, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.WEBCHAT:
        return [{ to: generatePath(Path.PUBLISH_WEBCHAT, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.SMS:
        return [
          { to: generatePath(Path.PUBLISH_SMS, { versionID }), title: 'Twilio SMS', icon },
          { to: generatePath(Path.PROTOTYPE_SMS, { versionID }), title: 'Test via SMS', icon: 'phone' },
        ];
      case Platform.Constants.PlatformType.WHATSAPP:
        return [
          { to: generatePath(Path.PUBLISH_WHATSAPP, { versionID }), title: 'WhatsApp Business', icon },
          { to: generatePath(Path.PROTOTYPE_WHATSAPP, { versionID }), title: 'Test on Phone', icon: 'phone' },
        ] as MenuOption[];
      case Platform.Constants.PlatformType.MICROSOFT_TEAMS:
        return [{ to: generatePath(Path.PUBLISH_TEAMS, { versionID }), title, icon: 'microsoftTeamsT' }];
      default:
        return [];
    }
  }, [canEditProject]);

  return (
    <>
      <CanvasIconMenu />

      <NavigationSidebar>
        <NavigationSidebar.ItemsContainer>
          {publishPaths.map(({ to, icon, title }) => (
            <NavigationSidebar.NavItem key={title} to={to} icon={icon} title={title} />
          ))}

          <NavigationSidebar.NavItem to={generatePath(Path.PUBLISH_API, { versionID })} icon="channel" title="Dialog API" />

          {projectAPIImprovements && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.PUBLISH_PROJECT_API, { versionID })}
              onClick={goToActiveProjectAPIPublish}
              icon="channel"
              title="Project API"
            />
          )}

          {!disableCodeExports && canExportCode && (
            <NavigationSidebar.NavItem to={generatePath(Path.PUBLISH_EXPORT, { versionID })} icon="systemCode" title="Code Export" />
          )}
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default IntegrationsSidebar;
