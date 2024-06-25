import type { BaseModels } from '@voiceflow/base-types';
import type { IntegrationData } from '@voiceflow/dtos';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBKnowledgeBaseIntegration, KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

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
