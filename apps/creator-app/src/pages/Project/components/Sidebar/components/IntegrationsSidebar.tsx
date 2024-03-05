import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
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
  const knowledgeBase = useKnowledgeBase();

  const { name: title } = Platform.Config.get(meta.platform);

  const {
    icon: { name: icon },
  } = Platform.Config.getTypeConfig(meta);

  const publishPaths = React.useMemo<MenuOption[]>(() => {
    if (!canEditProject) return [];

    switch (meta.platform) {
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

          <NavigationSidebar.NavItem
            to={generatePath(Path.PUBLISH_API, { versionID })}
            icon="channel"
            title="Dialog API"
            testID="integrations__tab--api-keys"
          />

          {knowledgeBase && (
            <NavigationSidebar.NavItem to={generatePath(Path.PUBLISH_KNOWLEDGE_BASE_API, { versionID })} icon="channel" title="Knowledge Base API" />
          )}

          {!disableCodeExports && canExportCode && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.PUBLISH_EXPORT, { versionID })}
              icon="systemCode"
              title="Code Export"
              testID="integrations__tab--code-export"
            />
          )}
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default IntegrationsSidebar;
