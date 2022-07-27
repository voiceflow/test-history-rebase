import './Skill.css';

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import { lazy } from '@/hocs';
import { useFeature, usePermission, useSelector } from '@/hooks';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

const PublishAmazon = lazy(() => import('./Amazon'));
const PublishGoogle = lazy(() => import('./Google'));
const PublishDialogflow = lazy(() => import('./Dialogflow'));
const Export = lazy(() => import('./Export'));
const API = lazy(() => import('./API'));

const Publish: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const [canCodeExport] = usePermission(Permission.CODE_EXPORT);
  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;

  return (
    <ProjectPage>
      <Switch>
        {!disableCodeExports && canCodeExport && <Route path={Path.PUBLISH_EXPORT} component={Export} />}
        {isAlexaPlatform(platform) && <Route path={Path.PUBLISH_ALEXA} component={PublishAmazon} />}
        {isGooglePlatform(platform) && <Route path={Path.PUBLISH_GOOGLE} component={PublishGoogle} />}
        {isDialogflowPlatform(platform) && <Route path={Path.PUBLISH_DIALOGFLOW} component={PublishDialogflow} />}

        <Route path={Path.PUBLISH_API} component={API} />

        <Redirect to={Path.PUBLISH_API} />
      </Switch>
    </ProjectPage>
  );
};

export default Publish;
