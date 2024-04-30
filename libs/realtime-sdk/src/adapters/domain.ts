import type { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { Domain } from '@/models';

const domainAdapter = createMultiAdapter<BaseModels.Version.Domain, Domain>(
  ({ id, live, name, status, topicIDs, updatedAt, rootDiagramID, updatedBy }) => ({
    id,
    live,
    name,
    status,
    topicIDs,
    updatedAt,
    updatedBy,
    rootDiagramID,
  }),
  ({ id, live, name, status, topicIDs, updatedAt, rootDiagramID, updatedBy }) => ({
    id,
    live,
    name,
    status,
    topicIDs,
    updatedAt,
    updatedBy,
    rootDiagramID,
  })
);

export default domainAdapter;
