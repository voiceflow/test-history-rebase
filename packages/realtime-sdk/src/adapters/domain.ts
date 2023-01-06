import { Domain } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

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
