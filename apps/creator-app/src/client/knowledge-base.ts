import { BaseModels } from '@voiceflow/base-types';

import { DBKnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

import api, { apiV3 } from './api';

export const knowledgeBaseClient = {
  getSettings: (projectID: string) =>
    apiV3.fetch.get<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`).then(({ data }) => data),

  patchSettings: (projectID: string, settings: Partial<BaseModels.Project.KnowledgeBaseSettings>) =>
    apiV3.fetch.patch(`/projects/${projectID}/knowledge-base/settings`, settings),

  getURLsFromSitemap: (projectID: string, sitemapURL: string) =>
    apiV3.fetch.post<string[]>(`/projects/${projectID}/knowledge-base/sitemap`, { sitemapURL }).then(({ data }) => data),

  getOneDocument: (projectID: string, documentID: string) =>
    apiV3.fetch.get<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents/${documentID}`).then(({ data }) => data),

  getOneDocumentData: (projectID: string, documentID: string) =>
    apiV3.fetch.get<{ data: Buffer }>(`/projects/${projectID}/knowledge-base/documents/${documentID}/download`).then(({ data }) => data.data),

  getAllDocuments: (projectID: string, documentIDs?: string[]) => {
    // eslint-disable-next-line dot-notation
    const url = apiV3.fetch['axios'].getUri({ url: `/projects/${projectID}/knowledge-base/documents`, params: { documentIDs } });

    return apiV3.fetch.get<DBKnowledgeBaseDocument[]>(url).then(({ data }) => data);
  },

  createOneDocument: (projectID: string, data: BaseModels.Project.KnowledgeBaseDocument['data']) =>
    apiV3.fetch.post<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents`, { data }).then(({ data }) => data),

  deleteOneDocument: (projectID: string, documentID: string) => apiV3.fetch.delete(`/projects/${projectID}/knowledge-base/documents/${documentID}`),

  createOneDocumentFromFormFile: (projectID: string, formData: FormData) =>
    apiV3.fetch.post<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents/file`, formData).then(({ data }) => data),

  updateManyDocuments: (projectID: string, documents: Partial<DBKnowledgeBaseDocument>[]) =>
    apiV3.fetch.post<void>(`/projects/${projectID}/knowledge-base/documents/update-many`, { documents }),

  refreshDocuments: (projectID: string, documentIDs: string[]) =>
    apiV3.fetch.post(`/projects/${projectID}/knowledge-base/documents/refresh`, { documentIDs }),

  patchVersionSettings: (versionID: string, settings: Partial<BaseModels.Project.KnowledgeBaseSettings>) =>
    api.fetch.patch(`/versions/${versionID}/knowledge-base/settings`, settings),

  getVersionSettings: (versionID: string) =>
    apiV3.fetch.get<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`).then(({ data }) => data),
};
