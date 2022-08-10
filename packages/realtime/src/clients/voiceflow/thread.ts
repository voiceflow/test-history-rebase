import { Adapters, Comment, DBComment, DBThread, Thread } from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface ThreadClient {
  find: (projectID: string) => Promise<Thread[]>;
  get: (projectID: string, threadID: string) => Promise<Thread>;
  create: (projectID: string, data: Thread) => Promise<Thread>;
  update: (projectID: string, data: Thread) => Promise<Thread>;
  comment: {
    create: (projectID: string, threadID: string, data: Comment) => Promise<Comment>;
    update: (projectID: string, commentID: string, data: Comment) => Promise<Comment>;
    delete: (projectID: string, commentID: string) => Promise<void>;
  };
}

export const COMMENTING_PATH = 'commenting/project';

const Client = ({ api }: ExtraOptions): ThreadClient => ({
  find: (projectID: string) =>
    api
      .get<{ threads: DBThread[] }>(`${COMMENTING_PATH}/${projectID}/threads`)
      .then(({ data: { threads } }) => Adapters.threadAdapter.mapFromDB(threads)),

  /** @deprecated */
  get: (projectID: string, threadID: string) =>
    api
      .get<{ thread: DBThread }>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`)
      .then(({ data: { thread } }) => Adapters.threadAdapter.fromDB(thread)),

  create: (projectID: string, data: Thread) =>
    api
      .post<DBThread>(`${COMMENTING_PATH}/${projectID}/threads`, Adapters.threadAdapter.toDB(data))
      .then(({ data }) => Adapters.threadAdapter.fromDB(data)),

  update: (projectID: string, data: Thread) => {
    const { resolved, node_id, position, deleted } = Adapters.threadAdapter.toDB(data);

    return api.put(`${COMMENTING_PATH}/${projectID}/threads/${data.id}`, { resolved, node_id, position, deleted });
  },

  comment: {
    create: (projectID: string, threadID: string, data: Comment) =>
      api
        .post<DBComment>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, Adapters.commentAdapter.toDB(data))
        .then(({ data }) => Adapters.commentAdapter.fromDB(data)),

    update: (projectID: string, commentID: string, data: Comment) =>
      api.put(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`, Adapters.commentAdapter.toDB(data)),

    delete: (projectID: string, commentID: string) => api.delete(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`),
  },
});

export default Client;
