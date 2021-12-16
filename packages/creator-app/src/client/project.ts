import { ProjectAPIKey } from '@/models';

import { apiV2 } from './fetch';

export const PROJECTS_PATH = 'projects';

const projectClient = {
  listAPIKeys: (projectID: string) => apiV2.get<ProjectAPIKey[]>(`${PROJECTS_PATH}/${projectID}/api-keys`),

  createAPIKey: ({ projectID, workspaceID }: { projectID: string; workspaceID: string }) =>
    apiV2.post<ProjectAPIKey>(`${PROJECTS_PATH}/${projectID}/api-keys`, { workspaceID, projectID }),
};

export default projectClient;
