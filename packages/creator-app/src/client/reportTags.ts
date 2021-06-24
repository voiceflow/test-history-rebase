import { ReportTag } from '@/models';

import { apiV2 } from './fetch';

export const REPORT_TAG_PATH = 'report_tags';

const reportTagsClient = {
  fetchTags: (projectID: string) => apiV2.get<ReportTag[]>(`${REPORT_TAG_PATH}/${projectID}`).then((data) => data),

  createTag: (projectID: string, { id, label }: { id?: string; label: string }) =>
    apiV2.put<ReportTag>(`${REPORT_TAG_PATH}/${projectID}`, { id, label }).then((data) => data),

  patchTag: (projectID: string, { id, label }: { id?: string; label: string }) =>
    apiV2.patch<ReportTag>(`${REPORT_TAG_PATH}/${projectID}/${id}`, { label }).then((data) => data),

  deleteTag: (projectID: string, id: string) => apiV2.delete(`${REPORT_TAG_PATH}/${projectID}/${id}`),
};

export default reportTagsClient;
