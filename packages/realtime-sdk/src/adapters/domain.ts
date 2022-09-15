import { Domain } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

const domainAdapter = createMultiAdapter<BaseModels.Version.Domain, Domain>(
  ({ id, live, name, status, topicIDs, rootDiagramID }) => ({ id, live, name, status, topicIDs, rootDiagramID }),
  ({ id, live, name, status, topicIDs, rootDiagramID }) => ({ id, live, name, status, topicIDs, rootDiagramID })
);

export default domainAdapter;
