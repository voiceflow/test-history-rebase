import { Domain } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import createAdapter from 'bidirectional-adapter';

const domainAdapter = createAdapter<BaseModels.Version.Domain, Domain>(
  ({ id, live, name, status, topicIDs, rootDiagramID }) => ({ id, live, name, status, topicIDs, rootDiagramID }),
  ({ id, live, name, status, topicIDs, rootDiagramID }) => ({ id, live, name, status, topicIDs, rootDiagramID })
);

export default domainAdapter;
