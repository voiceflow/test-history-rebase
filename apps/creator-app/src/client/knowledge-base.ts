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

  getAllDocuments: (projectID: string) =>
    apiV3.fetch.get<DBKnowledgeBaseDocument[]>(`/projects/${projectID}/knowledge-base/documents`).then(({ data }) => data),

  createOneDocument: (projectID: string, data: BaseModels.Project.KnowledgeBaseDocument['data']) =>
    apiV3.fetch.post<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents`, { data }).then(({ data }) => data),

  deleteOneDocument: (projectID: string, documentID: string) => apiV3.fetch.delete(`/projects/${projectID}/knowledge-base/documents/${documentID}`),

  createOneDocumentFromFormFile: (projectID: string, formData: FormData) =>
    apiV3.fetch.post<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents/file`, formData).then(({ data }) => data),

  patchVersionSettings: (versionID: string, settings: Partial<BaseModels.Project.KnowledgeBaseSettings>) =>
    api.fetch.patch(`/versions/${versionID}/knowledge-base/settings`, settings),

  getVersionSettings: (versionID: string) =>
    apiV3.fetch.get<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`).then(({ data }) => data),

  uploadDocumentFile: (projectID: string, formData: FormData) =>
    apiV3.fetch.post<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents/file`, formData).then(({ data }) => data),

  updateOneDocument: (projectID: string, documentID: string, data: Partial<DBKnowledgeBaseDocument>) =>
    apiV3.fetch.patch<DBKnowledgeBaseDocument>(`/projects/${projectID}/knowledge-base/documents/${documentID}`, data).then(({ data }) => data),
};
