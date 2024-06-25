import type { ProjectAPIKey } from '@/models';

import { apiV2 } from './fetch';

export const PROJECTS_PATH = 'projects';

const projectClient = {
  listAPIKeys: (projectID: string) => apiV2.get<ProjectAPIKey[]>(`${PROJECTS_PATH}/${projectID}/api-keys`),

  createAPIKey: ({ projectID, workspaceID }: { projectID: string; workspaceID: string }) =>
    apiV2.post<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys`, { workspaceID, projectID }),

  createSecondaryAPIKey: ({ projectID, apiKey }: { projectID: string; apiKey: string }) =>
    apiV2.post<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys/${apiKey}/secondary`),

  deleteSecondaryAPIKey: ({ projectID, apiKey }: { projectID: string; apiKey: string }) =>
    apiV2.delete<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys/${apiKey}/secondary`),

  promoteSecondaryAPIKey: ({ projectID, apiKey }: { projectID: string; apiKey: string }) =>
    apiV2.delete<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys/${apiKey}`),

  regeneratePrimaryAPIKey: ({ projectID, apiKey }: { projectID: string; apiKey: string }) =>
    apiV2.post<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys/${apiKey}/regenerate`),

  regenerateSecondaryAPIKey: ({ projectID, apiKey }: { projectID: string; apiKey: string }) =>
    apiV2.post<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys/${apiKey}/secondary/regenerate`),
};

export default projectClient;
