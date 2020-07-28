import { DBThread, NewThread, Thread } from '@/models';

import threadAdapter from './adapters/thread';
import fetch from './fetch';

export const COMMENTING_PATH = 'commenting/project';

const threadClient = {
  find: (projectID: string) =>
    fetch.get<{ threads: DBThread[] }>(`${COMMENTING_PATH}/${projectID}/threads`).then(({ threads }) => threadAdapter.mapFromDB(threads)),

  create: (projectID: string, data: NewThread) =>
    fetch.post<DBThread>(`${COMMENTING_PATH}/${projectID}/threads`, threadAdapter.toDB((data as unknown) as Thread)).then(threadAdapter.fromDB),

  update: (projectID: string, threadID: string, data: Thread) => {
    const { resolved, node_id, position } = threadAdapter.toDB(data);

    return fetch.put(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, { resolved, node_id, position });
  },

  delete: (projectID: string, threadID: string) => fetch.delete(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`),
};

export default threadClient;
