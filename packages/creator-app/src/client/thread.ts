import { Adapters, DBThread, NewThread, Thread } from '@voiceflow/realtime-sdk';

import { api } from './fetch';

export const COMMENTING_PATH = 'commenting/project';

const threadClient = {
  find: (projectID: string) =>
    api.get<{ threads: DBThread[] }>(`${COMMENTING_PATH}/${projectID}/threads`).then(({ threads }) => Adapters.threadAdapter.mapFromDB(threads)),

  get: (projectID: string, threadID: string) =>
    api.get<{ thread: DBThread }>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`).then(({ thread }) => Adapters.threadAdapter.fromDB(thread)),

  create: (projectID: string, data: NewThread) =>
    api
      .post<DBThread>(`${COMMENTING_PATH}/${projectID}/threads`, Adapters.threadAdapter.toDB(data as unknown as Thread))
      .then(Adapters.threadAdapter.fromDB),

  update: (projectID: string, threadID: string, data: Thread) => {
    const { resolved, node_id, position, deleted } = Adapters.threadAdapter.toDB(data);

    return api.put(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, { resolved, node_id, position, deleted });
  },
};

export default threadClient;
