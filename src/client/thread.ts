import { DBThread, Thread } from '@/models';

import threadAdapter from './adapters/thread';
import fetch from './fetch';

export const COMMENTING_PATH = 'commenting/project';

const threadClient = {
  find: (projectID: string) => fetch.get<DBThread[]>(`${COMMENTING_PATH}/${projectID}/threads`).then(threadAdapter.mapFromDB),

  create: (projectID: string, data: Thread) =>
    fetch.post<DBThread>(`${COMMENTING_PATH}/${projectID}/threads`, threadAdapter.toDB(data)).then(threadAdapter.fromDB),

  update: (projectID: string, threadID: string, data: Thread) =>
    fetch.put(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, threadAdapter.toDB(data)),

  delete: (projectID: string, threadID: string) => fetch.delete(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`),
};

export default threadClient;
