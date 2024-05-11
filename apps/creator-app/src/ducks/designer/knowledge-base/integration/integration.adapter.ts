import { BaseModels } from '@voiceflow/base-types';
import { IntegrationData } from '@voiceflow/dtos';
import { createMultiAdapter } from 'bidirectional-adapter';

import { DBKnowledgeBaseIntegration, KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

export const integrationAdapter = createMultiAdapter<DBKnowledgeBaseIntegration, KnowledgeBaseIntegration>(
  ({ ...rest }) => ({
    ...rest,
    id: rest.type,
  }),
  ({ id, ...rest }) => ({
    ...rest,
  })
);

export const realtimeIntegrationAdapter = createMultiAdapter<IntegrationData, KnowledgeBaseIntegration>(
  ({ ...rest }) => ({
    ...rest,
    id: rest.type,
    type: rest.type as BaseModels.Project.IntegrationTypes,
    creatorID: rest.creatorID || 0,
  }),
  ({ id, ...rest }) => ({
    ...rest,
  })
);
