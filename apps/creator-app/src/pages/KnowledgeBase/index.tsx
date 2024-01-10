import { BaseModels } from '@voiceflow/base-types';
import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';
import ProjectPage from '@/pages/Project/components/ProjectPage';

import { KnowledgeBaseContext, KnowledgeBaseTableItem } from './context';
import DatasourceTable from './DatasourceTable';

const DEFAULT_POLL_INTERVAL = 5000;

const isProcessing = (item: KnowledgeBaseTableItem) =>
  ![BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR].includes(item.status.type);

const KnowledgeBaseDashboard: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();
  const syncInterval = React.useRef<number | null>(null);
  const { state, actions } = React.useContext(KnowledgeBaseContext);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const clearSyncInterval = React.useCallback(() => {
    if (!syncInterval.current) return;
    clearInterval(syncInterval.current);
    syncInterval.current = null;
  }, []);

  React.useEffect(() => {
    const processing = state.documents.some(isProcessing);

    if (processing && !syncInterval.current) {
      syncInterval.current = window.setInterval(() => {
        actions.sync();
      }, DEFAULT_POLL_INTERVAL);
    } else if (!processing) {
      clearSyncInterval();
    }
  }, [state.documents]);

  React.useEffect(() => {
    actions.sync();
    trackingEvents.trackAiKnowledgeBaseOpen();

    return clearSyncInterval;
  }, []);

  React.useEffect(() => {
    goToCMSResource(CMSRoute.KNOWLEDGE_BASE);
  }, []);

  return (
    <ProjectPage>
      <LoadingGate label="Knowledge Base" internalName={KnowledgeBaseDashboard.name} isLoaded={!!state.updatedAt}>
        <DatasourceTable />
      </LoadingGate>
    </ProjectPage>
  );
};

export default KnowledgeBaseDashboard;
