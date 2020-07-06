import { Comment, DBComment } from '@/models';

import { commentAdapter } from './adapters/comment';
import fetch from './fetch';

export const COMMENTING_PATH = 'commenting/project';

const commentClient = {
  create: (projectID: string, threadID: string, data: Comment) =>
    fetch.post<DBComment>(`${COMMENTING_PATH}/${projectID}/threads/${threadID}`, commentAdapter.toDB(data)).then(commentAdapter.fromDB),

  update: (projectID: string, commentID: string, data: Comment) =>
    fetch.post(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`, commentAdapter.toDB(data)),

  delete: (projectID: string, commentID: string) => fetch.put(`${COMMENTING_PATH}/${projectID}/comment/${commentID}`),
};

export default commentClient;
