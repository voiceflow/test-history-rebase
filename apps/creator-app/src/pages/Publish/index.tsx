import './Skill.css';

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
import { useAlexaProjectSettings } from '@/hooks/project';
import { useSelector } from '@/hooks/redux';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import {
  isAlexaPlatform,
  isDialogflowPlatform,
  isGooglePlatform,
  isMicrosoftTeamsPlatform,
  isSMSPlatform,
  isWebChatPlatform,
  isWhatsAppPlatform,
} from '@/utils/typeGuards';

import API from './API';

const PublishAmazon = lazy(() => import('./Amazon'));
const PublishGoogle = lazy(() => import('./Google'));
const PublishDialogflow = lazy(() => import('./Dialogflow'));
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
  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const canUseAlexaSettings = useAlexaProjectSettings();

  return (
    <ProjectPage>
      <Page.Content>
        <Switch>
          {!disableCodeExports && canCodeExport && <Route path={Path.PUBLISH_EXPORT} component={Export} />}
          {isAlexaPlatform(platform) && canUseAlexaSettings && <Route path={Path.PUBLISH_ALEXA} component={PublishAmazon} />}
          {isGooglePlatform(platform) && <Route path={Path.PUBLISH_GOOGLE} component={PublishGoogle} />}
          {isDialogflowPlatform(platform) && <Route path={Path.PUBLISH_DIALOGFLOW} component={PublishDialogflow} />}
          {isWebChatPlatform(platform) && <Route path={Path.PUBLISH_WEBCHAT} component={PublishWebchat} />}
          {isSMSPlatform(platform) && <Route path={Path.PUBLISH_SMS} component={PublishSMS} />}
          {isSMSPlatform(platform) && <Route path={Path.PROTOTYPE_SMS} component={PrototypeSMS} />}
          {isWhatsAppPlatform(platform) && <Route path={Path.PUBLISH_WHATSAPP} component={PublishWhatsApp} />}
          {isWhatsAppPlatform(platform) && <Route path={Path.PROTOTYPE_WHATSAPP} component={PrototypeWhatsApp} />}
          {isMicrosoftTeamsPlatform(platform) && <Route path={Path.PUBLISH_TEAMS} component={PublishTeams} />}

          <Route path={Path.PUBLISH_API} component={API} />

          <Redirect to={Path.PUBLISH_API} />
        </Switch>
      </Page.Content>
    </ProjectPage>
  );
};

export default Publish;
