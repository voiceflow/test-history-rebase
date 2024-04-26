import reportTagsAdapter from '@/client/adapters/reportTags';
import type { DBReportTag } from '@/models';

import { apiV2 } from './fetch';

export const PROJECT_PATH = 'projects';

const reportTagsClient = {
  fetchTags: (projectID: string) =>
    apiV2
      .get<Record<string, DBReportTag>>(`${PROJECT_PATH}/${projectID}/tags`)
      .then((data) => Object.values(data).map((tag) => reportTagsAdapter.fromDB(tag, { projectID }))),

  createTag: (projectID: string, tag: { tagID?: string; label: string }) =>
    apiV2
      .put<DBReportTag>(`${PROJECT_PATH}/${projectID}/tags`, tag)
      .then((data) => reportTagsAdapter.fromDB(data, { projectID })),

  patchTag: (projectID: string, { tagID, label }: { tagID: string; label: string }) =>
    apiV2.patch(`${PROJECT_PATH}/${projectID}/tags/${tagID}`, { label }),

  deleteTag: (projectID: string, tagID: string) => apiV2.delete(`${PROJECT_PATH}/${projectID}/tags/${tagID}`),
};

export default reportTagsClient;
