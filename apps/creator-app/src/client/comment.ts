import { Adapters, Comment, DBComment } from '@voiceflow/realtime-sdk';

import { api } from './fetch';

export const COMMENTING_PATH = 'commenting/project';

const commentClient = {
  create: (projectID: string, threadID: string, data: Comment) =>
    api
      .post<DBComment>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, Adapters.commentAdapter.toDB(data))
      .then(Adapters.commentAdapter.fromDB),

  update: (projectID: string, commentID: string, data: Comment) =>
    api.put(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`, Adapters.commentAdapter.toDB(data)),

  delete: (projectID: string, commentID: string) => api.delete(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`),
};

export default commentClient;
