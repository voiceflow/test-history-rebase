import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { lazy } from '@/hocs/lazy.hoc';
import { withSuspense } from '@/hocs/suspense.hoc';

import { CMSLayout } from './components/CMSLayout/CMSLayout.component';
import { CMSPageLoader } from './components/CMSPageLoader';

const AssistantCMSIntent = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSIntent', factory: () => import('./pages/CMSIntent/CMSIntent.page') })
);
const AssistantCMSEntities = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSEntities', factory: () => import('./pages/CMSEntity/CMSEntity.page') })
);

const AssistantCMS = () => (
  <CMSLayout>
    <Switch>
      <Route path={Path.CMS_INTENT} component={AssistantCMSIntent} />

      <Route path={Path.CMS_ENTITY} component={AssistantCMSEntities} />

      <Redirect to={Path.CMS_INTENT} />
    </Switch>
  </CMSLayout>
);

export default AssistantCMS;
