import { PlatformType } from '@/constants';
import { DBProject } from '@/models';

import projectAdapter from './adapters/project';
import fetch, { NetworkError, StatusCode } from './fetch';

const VERSION_PATH = 'version';
const PROJECT_PATH = 'project';
const PROJECTS_PATH = 'projects';
const TEAM_PATH = 'team';

export type ProjectVersion = {
  skill_id: string;
  published_platform: PlatformType;
  created: string;
};

const projectClient = {
  copyReference: (referenceID: string, teamID: string) =>
    fetch.post<DBProject>(`${TEAM_PATH}/${teamID}/insert/reference/${referenceID}`).then(projectAdapter.fromDB),

  copy: (versionID: string, teamID: string) => fetch.post<DBProject>(`${VERSION_PATH}/${versionID}/copy/team/${teamID}`).then(projectAdapter.fromDB),

  delete: (projectID: string) =>
    fetch.delete(`${PROJECTS_PATH}/${projectID}`).catch((err) => {
      if (err instanceof NetworkError && err.statusCode === StatusCode.FORBIDDEN) {
        throw new NetworkError(err.statusCode, 'Project has active users and cannot be deleted at the moment');
      } else {
        throw new NetworkError(err.statusCode || StatusCode.SERVER_ERROR, 'Error Deleting Project');
      }
    }),

  import: (token: string, teamID: string) =>
    fetch
      .post<DBProject>(`importProject/${teamID}/`, { token })
      .then(projectAdapter.fromDB),

  claimReference: (projectID: string) => fetch.post(`${PROJECT_PATH}/${projectID}/use_reference`),

  updateVendorId: (projectID: string, vendorID: string) => fetch.post<string>(`${PROJECT_PATH}/${projectID}/vendor_id`, { vendor_id: vendorID }),

  getImportToken: (projectID: string) => fetch.get<string>(`exportProject/${projectID}`),

  getLiveVersion: (projectID: string) => fetch.get<{ live_skill: string; live_version: string }>(`${PROJECT_PATH}/${projectID}/live_version`),

  getVersions: (projectID: string) => fetch.get<ProjectVersion[]>(`${PROJECT_PATH}/${projectID}/versions`),

  updateAmznId: (projectID: string, vendorID: string, amznID: string) =>
    fetch.patch<string>(`${PROJECT_PATH}/${projectID}/amzn_id`, { id: amznID.trim(), vendorID }),
};

export default projectClient;
