import { PlatformType } from '@/constants';
import { DBProject } from '@/models';

import projectAdapter from './adapters/project';
import fetch, { NetworkError, StatusCode } from './fetch';

export const VERSION_PATH = 'version';
export const PROJECT_PATH = 'project';
export const PROJECTS_PATH = 'projects';
export const TEAM_PATH = 'team';

export type ProjectVersion = {
  skill_id: string;
  published_platform: PlatformType;
  created: string;
  platform: PlatformType;
};

const projectClient = {
  copyReference: (referenceID: string, teamID: string) =>
    fetch.post<DBProject>(`${TEAM_PATH}/${teamID}/insert/reference/${referenceID}`).then(projectAdapter.fromDB),

  copy: (versionID: string, teamID: string) => fetch.post<DBProject>(`${VERSION_PATH}/${versionID}/copy/team/${teamID}`).then(projectAdapter.fromDB),

  delete: (projectID: string) =>
    fetch.delete(`${PROJECTS_PATH}/${projectID}`).catch((err: Error | NetworkError<any>) => {
      const statusCode = (err instanceof NetworkError && err.statusCode) || StatusCode.SERVER_ERROR;

      if (statusCode === StatusCode.FORBIDDEN) {
        throw new NetworkError(statusCode, 'Project has active users and cannot be deleted at the moment');
      } else {
        throw new NetworkError(statusCode, 'Error Deleting Project');
      }
    }),

  claimReference: (projectID: string) => fetch.post<{ skill_id: string }>(`${PROJECT_PATH}/${projectID}/use_reference`),

  updateVendorId: (projectID: string, vendorID: string) => fetch.post<string>(`${PROJECT_PATH}/${projectID}/vendor_id`, { vendor_id: vendorID }),

  getLiveVersion: (projectID: string) => fetch.get<{ live_skill: string; live_version: string }>(`${PROJECT_PATH}/${projectID}/live_version`),

  getVersions: (projectID: string) => fetch.get<ProjectVersion[]>(`${PROJECT_PATH}/${projectID}/versions`),

  updateAmznId: (projectID: string, vendorID: string, amznID: string) =>
    fetch.patch<string>(`${PROJECT_PATH}/${projectID}/amzn_id`, { id: amznID.trim(), vendorID }),
};

export default projectClient;
