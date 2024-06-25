import type { Comment, DBComment, DBThread, NewComment, NewThread, Thread } from '@voiceflow/realtime-sdk/backend';
import { Adapters } from '@voiceflow/realtime-sdk/backend';

import type { ExtraOptions } from './types';

export interface ThreadClient {
  find: (projectID: string) => Promise<Thread[]>;
  get: (projectID: string, threadID: string) => Promise<Thread>;
  create: (projectID: string, data: NewThread) => Promise<Thread>;
  update: (projectID: string, threadID: string, data: Partial<Thread>) => Promise<Thread>;
  removeMany: (projectID: string, data: { diagramIDs: string[] }) => Promise<void>;
  comment: {
    create: (projectID: string, threadID: string, data: NewComment) => Promise<Comment>;
    update: (projectID: string, commentID: string, data: NewComment) => Promise<Comment>;
    delete: (projectID: string, commentID: string) => Promise<void>;
  };
}

export const COMMENTING_PATH = 'commenting/project';

const Client = ({ api }: ExtraOptions): ThreadClient => ({
  find: (projectID: string) =>
    api
      .get<{ threads: DBThread[] }>(`${COMMENTING_PATH}/${projectID}/threads`)
      .then(({ data: { threads } }) => Adapters.threadAdapter.mapFromDB(threads)),

  get: (projectID: string, threadID: string) =>
    api
      .get<{ thread: DBThread }>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`)
      .then(({ data: { thread } }) => Adapters.threadAdapter.fromDB(thread)),

  create: (projectID: string, data: NewThread) =>
    api
      .post<DBThread>(`${COMMENTING_PATH}/${projectID}/threads`, Adapters.threadAdapter.toDB(data as unknown as Thread))
      .then(({ data }) => Adapters.threadAdapter.fromDB(data)),

  removeMany: (projectID: string, data: { diagramIDs: string[] }) =>
    api.post(`${COMMENTING_PATH}/${projectID}/threads/remove-many`, data),

  update: (projectID: string, threadID: string, data: Partial<Thread>) => {
    const { nodeID, resolved, deleted, position } = data;

    const payload: Partial<DBThread> = {
      ...(nodeID && { node_id: nodeID }),
      ...(position && { position }),
      ...{ resolved: resolved ?? undefined },
      ...{ deleted: deleted ?? undefined },
    };

    return api.put(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, payload);
  },

  comment: {
    create: (projectID: string, threadID: string, data: NewComment) =>
      api
        .post<DBComment>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, data)
        .then(({ data }) => Adapters.commentAdapter.fromDB(data)),

    update: (projectID: string, commentID: string, data: NewComment) =>
      api.put(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`, data),

    delete: (projectID: string, commentID: string) =>
      api.delete(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`),
  },
});

export default Client;
