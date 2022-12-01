import './Skill.css';

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import { lazy } from '@/hocs';
import { useAlexaProjectSettings, useFeature, usePermission, useSelector } from '@/hooks';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import {
  isAlexaPlatform,
  isDialogflowPlatform,
  isGooglePlatform,
  isMicrosoftTeamsPlatform,
  isWebChatPlatform,
  isWhatsAppPlatform,
} from '@/utils/typeGuards';

const PublishAmazon = lazy(() => import('./Amazon'));
const PublishGoogle = lazy(() => import('./Google'));
const PublishDialogflow = lazy(() => import('./Dialogflow'));
const PublishWebchat = lazy(() => import('./Webchat'));
const PublishWhatsApp = lazy(() => import('./WhatsApp'));
const TestWhatsApp = lazy(() => import('./WhatsApp/test'));
const PublishTeams = lazy(() => import('./MicrosoftTeams'));
const Export = lazy(() => import('./Export'));
const API = lazy(() => import('./API'));

const Publish: React.FC = () => {
  const { platform } = useSelector(ProjectV2.active.metaSelector);
  const [canCodeExport] = usePermission(Permission.CODE_EXPORT);
  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const canUseAlexaSettings = useAlexaProjectSettings();

  return (
    <ProjectPage>
      <Switch>
        {!disableCodeExports && canCodeExport && <Route path={Path.PUBLISH_EXPORT} component={Export} />}
        {isAlexaPlatform(platform) && canUseAlexaSettings && <Route path={Path.PUBLISH_ALEXA} component={PublishAmazon} />}
        {isGooglePlatform(platform) && <Route path={Path.PUBLISH_GOOGLE} component={PublishGoogle} />}
        {isDialogflowPlatform(platform) && <Route path={Path.PUBLISH_DIALOGFLOW} component={PublishDialogflow} />}
        {isWebChatPlatform(platform) && <Route path={Path.PUBLISH_WEBCHAT} component={PublishWebchat} />}
        {isWhatsAppPlatform(platform) && <Route path={Path.PUBLISH_WHATSAPP} component={PublishWhatsApp} />}
        {isWhatsAppPlatform(platform) && <Route path={Path.TEST_WHATSAPP} component={TestWhatsApp} />}
        {isMicrosoftTeamsPlatform(platform) && <Route path={Path.PUBLISH_TEAMS} component={PublishTeams} />}

        <Route path={Path.PUBLISH_API} component={API} />

        <Redirect to={Path.PUBLISH_API} />
      </Switch>
    </ProjectPage>
  );
};

export default Publish;
