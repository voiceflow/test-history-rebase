import projectAdapter from './adapters/project';
import fetch, { NetworkError, StatusCode } from './fetch';

const VERSION_PATH = 'version';
const PROJECT_PATH = 'project';
const PROJECTS_PATH = 'projects';
const TEAM_PATH = 'team';

const projectClient = {
  copyReference: (referenceID, teamID) => fetch.post(`${TEAM_PATH}/${teamID}/insert/reference/${referenceID}`).then(projectAdapter.fromDB),

  copy: (versionID, teamID) => fetch.post(`${VERSION_PATH}/${versionID}/copy/team/${teamID}`).then(projectAdapter.fromDB),

  delete: (projectID) =>
    fetch.delete(`${PROJECTS_PATH}/${projectID}`).catch((err) => {
      if (err instanceof NetworkError && err.statusCode === StatusCode.FORBIDDEN) {
        throw new NetworkError(err.statusCode, 'Project has active users and cannot be deleted at the moment');
      } else {
        throw new NetworkError(err.statusCode || StatusCode.SERVER_ERROR, 'Error Deleting Project');
      }
    }),

  import: (token, teamID) => fetch.post(`importProject/${teamID}/`, { token }).then(projectAdapter.fromDB),

  claimReference: (projectID) => fetch.post(`${PROJECT_PATH}/${projectID}/use_reference`),

  updateVendorId: (projectID, vendorId) => fetch.post(`${PROJECT_PATH}/${projectID}/vendor_id`, { vendor_id: vendorId }),

  getImportToken: (projectID) => fetch.get(`exportProject/${projectID}`),

  getLiveVersion: (projectID) => fetch.get(`${PROJECT_PATH}/${projectID}/live_version`),

  getVersions: (projectID) => fetch.get(`${PROJECT_PATH}/${projectID}/versions`),

  updateAmznId: (projectID, vendorID, AmznID) => fetch.patch(`${PROJECT_PATH}/${projectID}/amzn_id`, { id: AmznID.trim(), vendorID }),
};

export default projectClient;
