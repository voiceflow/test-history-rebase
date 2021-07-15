import './Skill.css';

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as Project from '@/ducks/project';
import { lazy } from '@/hocs';
import { usePermission, useSelector } from '@/hooks';
import { isAlexaPlatform, isGooglePlatform } from '@/utils/typeGuards';

const PublishAmazon = lazy(() => import('./Amazon'));
const PublishGoogle = lazy(() => import('./Google'));
const Export = lazy(() => import('./Export'));
const API = lazy(() => import('./API'));

const Publish: React.FC = () => {
  const platform = useSelector(Project.activePlatformSelector);
  const [canCodeExport] = usePermission(Permission.CODE_EXPORT);

  return (
    <Switch>
      {canCodeExport && <Route path={Path.PUBLISH_EXPORT} component={Export} />}
      {isAlexaPlatform(platform) && <Route path={Path.PUBLISH_ALEXA} component={PublishAmazon} />}
      {isGooglePlatform(platform) && <Route path={Path.PUBLISH_GOOGLE} component={PublishGoogle} />}

      <Route path={Path.PUBLISH_API} component={API} />

      <Redirect to={Path.PUBLISH_API} />
    </Switch>
  );
};

export default Publish;
