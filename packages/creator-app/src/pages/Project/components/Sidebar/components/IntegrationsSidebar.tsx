import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useAlexaProjectSettings, useFeature, usePermission, useSelector } from '@/hooks';

import { SideBarComponentProps } from '../types';
import CanvasIconMenu from './CanvasIconMenu';

const IntegrationsSidebar: React.FC<SideBarComponentProps> = () => {
  const { platform } = useSelector(ProjectV2.active.metaSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const [canExportCode] = usePermission(Permission.CODE_EXPORT);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const canUseAlexaSettings = useAlexaProjectSettings();

  const platformConfig = Platform.Config.get(platform);

  const publishPath = React.useMemo(() => {
    switch (platformConfig.type) {
      case Platform.Constants.PlatformType.ALEXA:
        return canUseAlexaSettings ? generatePath(Path.PUBLISH_ALEXA, { versionID }) : null;
      case Platform.Constants.PlatformType.GOOGLE:
        return generatePath(Path.PUBLISH_GOOGLE, { versionID });
      case Platform.Constants.PlatformType.DIALOGFLOW_ES:
        return generatePath(Path.PUBLISH_DIALOGFLOW, { versionID });
      case Platform.Constants.PlatformType.WEBCHAT:
        return generatePath(Path.PUBLISH_WEBCHAT, { versionID });
      default:
        return null;
    }
  }, []);

  const platformIcon = Object.values(platformConfig.types)[0]?.icon;

  return (
    <>
      <CanvasIconMenu />

      <NavigationSidebar>
        <NavigationSidebar.ItemsContainer>
          {publishPath && <NavigationSidebar.NavItem to={publishPath} icon={platformIcon.name} title={platformConfig.name} />}

          <NavigationSidebar.NavItem to={generatePath(Path.PUBLISH_API, { versionID })} icon="channel" title="Dialog API" />

          {!disableCodeExports && canExportCode && (
            <NavigationSidebar.NavItem to={generatePath(Path.PUBLISH_EXPORT, { versionID })} icon="systemCode" title="Code Export" />
          )}
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default IntegrationsSidebar;
