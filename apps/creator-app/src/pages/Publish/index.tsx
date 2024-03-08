import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import { lazy } from '@/hocs/lazy';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import { isMicrosoftTeamsPlatform, isSMSPlatform, isWebChatPlatform, isWhatsAppPlatform } from '@/utils/typeGuards';

import API from './API';

const PublishWebchat = lazy(() => import('./Webchat'));
const PublishSMS = lazy(() => import('./SMS'));
const PrototypeSMS = lazy(() => import('./SMS/Prototype'));
const PublishWhatsApp = lazy(() => import('./WhatsApp'));
const PrototypeWhatsApp = lazy(() => import('./WhatsApp/Prototype'));
const PublishTeams = lazy(() => import('./MicrosoftTeams'));
const Export = lazy(() => import('./Export'));

const Publish: React.FC = () => {
  const { platform } = useSelector(ProjectV2.active.metaSelector);

  const [canCodeExport] = usePermission(Permission.CODE_EXPORT);
  const [canEditAPIKey] = usePermission(Permission.API_KEY_EDIT);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return (
    <ProjectPage>
      <Page.Content>
        <Switch>
          {isSMSPlatform(platform) && canEditProject && <Route path={Path.PUBLISH_SMS} component={PublishSMS} />}
          {isSMSPlatform(platform) && canEditProject && <Route path={Path.PROTOTYPE_SMS} component={PrototypeSMS} />}
          {isWebChatPlatform(platform) && canEditProject && <Route path={Path.PUBLISH_WEBCHAT} component={PublishWebchat} />}
          {isWhatsAppPlatform(platform) && canEditProject && <Route path={Path.PUBLISH_WHATSAPP} component={PublishWhatsApp} />}
          {isWhatsAppPlatform(platform) && canEditProject && <Route path={Path.PROTOTYPE_WHATSAPP} component={PrototypeWhatsApp} />}
          {isMicrosoftTeamsPlatform(platform) && canEditProject && <Route path={Path.PUBLISH_TEAMS} component={PublishTeams} />}

          {!disableCodeExports.isEnabled && canCodeExport && <Route path={Path.PUBLISH_EXPORT} component={Export} />}
          {(canEditAPIKey || viewerAPIKeyAccess.isEnabled) && <Route path={Path.PUBLISH_API} component={API} />}

          <Redirect to={canEditAPIKey || viewerAPIKeyAccess.isEnabled ? Path.PUBLISH_API : Path.PROJECT_VERSION} />
        </Switch>
      </Page.Content>
    </ProjectPage>
  );
};

export default Publish;
