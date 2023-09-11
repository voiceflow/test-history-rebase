import * as Realtime from '@voiceflow/realtime-sdk';
import { PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useFeature } from '@/hooks/feature';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { usePermission } from '@/hooks/permission';

export const AssistantMenu: React.FC = () => {
  const location = useLocation();
  const onLinkClick = useOnLinkClick();
  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);

  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

  return (
    <PrimaryNavigation>
      <PrimaryNavigation.Section>
        <PrimaryNavigation.Item onClick={onLinkClick(Path.PROJECT_CMS)} isActive={isItemActive(Path.PROJECT_CMS)} iconName="Designer" />

        {(canEditAPIKey || viewerAPIKeyAccess.isEnabled) && (
          <PrimaryNavigation.Item onClick={onLinkClick(Path.PUBLISH_API)} isActive={isItemActive(Path.PUBLISH_API)} iconName="Api" />
        )}

        {canEditProject && (
          <PrimaryNavigation.Item onClick={onLinkClick(Path.PROJECT_SETTINGS)} isActive={isItemActive(Path.PROJECT_SETTINGS)} iconName="Settings" />
        )}
      </PrimaryNavigation.Section>

      <PrimaryNavigation.Section>
        <PrimaryNavigation.Item iconName="Info" />
      </PrimaryNavigation.Section>
    </PrimaryNavigation>
  );
};
