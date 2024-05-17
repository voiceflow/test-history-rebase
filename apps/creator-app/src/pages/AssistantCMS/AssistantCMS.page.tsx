import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import { lazy } from '@/hocs/lazy.hoc';
import { withSuspense } from '@/hocs/suspense.hoc';
import { useFeature } from '@/hooks/feature';
import { useDispatch } from '@/hooks/store.hook';

import { CMSLayout } from './components/CMSLayout/CMSLayout.component';
import { CMSPageLoader } from './components/CMSPageLoader.component';
import { useCMSRoute } from './hooks/cms-route.hook';

const AssistantCMSIntent = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSIntent', factory: () => import('./pages/CMSIntent/CMSIntent.page') })
);
const AssistantCMSEntity = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSEntity', factory: () => import('./pages/CMSEntity/CMSEntity.page') })
);
const AssistantCMSVariable = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSVariable', factory: () => import('./pages/CMSVariable/CMSVariable.page') })
);
const AssistantCMSFlow = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSFlow', factory: () => import('./pages/CMSFlow/CMSFlow.page') })
);
const AssistantCMSWorkflow = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSWorkflow', factory: () => import('./pages/CMSWorkflow/CMSWorkflow.page') })
);
const AssistantCMSFunction = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSFunction', factory: () => import('./pages/CMSFunction/CMSFunction.page') })
);
const AssistantCMSKnowledgeBase = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSKnowledgeBase', factory: () => import('./pages/CMSKnowledgeBase/CMSKnowledgeBase.page') })
);
const AssistantCMSResponse = withSuspense({ loader: <CMSPageLoader /> })(
  lazy({ name: 'CMSResponse', factory: () => import('./pages/CMSResponse/CMSResponse.page') })
);

const AssistantCMS = () => {
  const { activeCMSRoute } = useCMSRoute();

  const loadKBSettings = useDispatch(Designer.KnowledgeBase.effect.loadSettings);
  const loadKBDocuments = useDispatch(Designer.KnowledgeBase.Document.effect.loadAll);

  const { isEnabled: isKbEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);
  const { isEnabled: isCMSResponsesEnabled } = useFeature(Realtime.FeatureFlag.CMS_RESPONSES);
  const { isEnabled: isCMSWorkflowsEnabled } = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);
  const { isEnabled: isCMSFunctionsEnabled } = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);

  React.useEffect(() => {
    if (isKbEnabled) {
      loadKBSettings();
      loadKBDocuments();
    }
  }, [isKbEnabled]);

  return (
    <CMSLayout>
      <Switch>
        <Route path={Path.CMS_INTENT} component={AssistantCMSIntent} />

        <Route path={Path.CMS_ENTITY} component={AssistantCMSEntity} />

        <Route path={Path.CMS_VARIABLE} component={AssistantCMSVariable} />

        <Route path={Path.CMS_FLOW} component={AssistantCMSFlow} />

        {isKbEnabled && <Route path={Path.CMS_KNOWLEDGE_BASE} component={AssistantCMSKnowledgeBase} />}

        {isCMSResponsesEnabled && <Route path={Path.CMS_RESPONSE} component={AssistantCMSResponse} />}

        {isCMSFunctionsEnabled && <Route path={Path.CMS_FUNCTION} component={AssistantCMSFunction} />}

        {isCMSWorkflowsEnabled && <Route path={Path.CMS_WORKFLOW} component={AssistantCMSWorkflow} />}

        <Redirect to={`${Path.PROJECT_CMS}/${activeCMSRoute}`} />
      </Switch>
    </CMSLayout>
  );
};

export default AssistantCMS;
