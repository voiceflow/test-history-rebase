import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { lazy } from '@/hocs/lazy.hoc';
import { withSuspense } from '@/hocs/suspense.hoc';
import { useFeature } from '@/hooks';

import { CMSLayout } from './components/CMSLayout/CMSLayout.component';
import { CMSPageLoader } from './components/CMSPageLoader';
import { CMSKnowledgeBaseProvider } from './contexts/CMSKnowledgeBase.context';

const AssistantCMSIntent = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSIntent', factory: () => import('./pages/CMSIntent/CMSIntent.page') })
);
const AssistantCMSEntity = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSEntity', factory: () => import('./pages/CMSEntity/CMSEntity.page') })
);
const AssistantCMSFunction = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSFunction', factory: () => import('./pages/CMSFunction/CMSFunction.page') })
);
const AssistantCMSKnowledgeBase = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSKnowledgeBase', factory: () => import('./pages/CMSKnowledgeBase/CMSKnowledgeBase.page') })
);

const AssistantCMS = () => {
  const { isEnabled: isKbCmsEnabled } = useFeature(Realtime.FeatureFlag.CMS_KB);
  const { isEnabled: isFunctionsCmsEnabled } = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);

  return (
    <CMSKnowledgeBaseProvider>
      <CMSLayout>
        <Switch>
          <Route path={Path.CMS_INTENT} component={AssistantCMSIntent} />

          <Route path={Path.CMS_ENTITY} component={AssistantCMSEntity} />

          {isFunctionsCmsEnabled && <Route path={Path.CMS_FUNCTION} component={AssistantCMSFunction} />}

          {isKbCmsEnabled && <Route path={Path.CMS_KNOWLEDGE_BASE} component={AssistantCMSKnowledgeBase} />}

          <Redirect to={Path.CMS_INTENT} />
        </Switch>
      </CMSLayout>
    </CMSKnowledgeBaseProvider>
  );
};

export default AssistantCMS;
