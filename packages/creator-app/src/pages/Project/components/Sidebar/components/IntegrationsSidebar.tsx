import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
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
  const meta = useSelector(ProjectV2.active.metaSelector);

  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const [canExportCode] = usePermission(Permission.CODE_EXPORT);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const canUseAlexaSettings = useAlexaProjectSettings();

  const { name: title } = Platform.Config.get(meta.platform);

  const {
    icon: { name: icon },
  } = Platform.Config.getTypeConfig(meta);

  const publishPaths = React.useMemo<{ to: string; title: string; icon: SvgIconTypes.Icon }[]>(() => {
    switch (meta.platform) {
      case Platform.Constants.PlatformType.ALEXA:
        return canUseAlexaSettings ? [{ to: generatePath(Path.PUBLISH_ALEXA, { versionID }), title, icon }] : [];
      case Platform.Constants.PlatformType.GOOGLE:
        return [{ to: generatePath(Path.PUBLISH_GOOGLE, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.DIALOGFLOW_ES:
        return [{ to: generatePath(Path.PUBLISH_DIALOGFLOW, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.WEBCHAT:
        return [{ to: generatePath(Path.PUBLISH_WEBCHAT, { versionID }), title, icon }];
      case Platform.Constants.PlatformType.WHATSAPP:
        return [
          { to: generatePath(Path.PUBLISH_WHATSAPP, { versionID }), title: 'WhatsApp Business', icon },
          { to: generatePath(Path.TEST_WHATSAPP, { versionID }), title: 'Test on Phone', icon: 'phone' },
        ];
      default:
        return [];
    }
  }, []);

  return (
    <>
      <CanvasIconMenu />

      <NavigationSidebar>
        <NavigationSidebar.ItemsContainer>
          {publishPaths.map(({ to, icon, title }) => (
            <NavigationSidebar.NavItem key={title} to={to} icon={icon} title={title} />
          ))}

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
