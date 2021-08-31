import { Adapters } from '@voiceflow/realtime-sdk';

import { DBThread, Thread } from '@/models';

import commentAdapter from './comment';

const threadAdapter = Adapters.createAdapter<DBThread, Thread>(
  ({ thread_id, project_id, diagram_id, node_id, creator_id, comments, ...thread }: DBThread) => ({
    ...thread,
    id: thread_id,
    projectID: project_id,
    diagramID: diagram_id,
    nodeID: node_id,
    creatorID: creator_id,
    comments: commentAdapter.mapFromDB(comments),
  }),
  ({ id, projectID, diagramID, nodeID, creatorID, comments, ...thread }: Thread) => ({
    ...thread,
    thread_id: id,
    project_id: projectID,
    diagram_id: diagramID,
    node_id: nodeID,
    creator_id: creatorID,
    comments: commentAdapter.mapToDB(comments),
  })
);

export default threadAdapter;
