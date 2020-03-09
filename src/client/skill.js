import diagramAdapter from './adapters/diagram';
import displayAdapter from './adapters/display';
import productAdapter from './adapters/product';
import fetch from './fetch';

const SKILL_PATH = 'skill';
const DISPLAYS_PATH = 'multimodal/displays';

const skillClient = {
  get: (skillID) => fetch.get(`${SKILL_PATH}/${skillID}?simple=1&user_modules=1`),

  update: (skillID, body) => fetch.patch(`${SKILL_PATH}/${skillID}`, body),

  updateInvName: (skillID, invName) => fetch.patch(`${SKILL_PATH}/${skillID}?inv_name=1`, { inv_name: invName }),

  updateAccountLinking: (skillID, body) => fetch.post(`link_account/template/${skillID}`, body),

  findDiagrams: (skillID) => fetch.get(`${SKILL_PATH}/${skillID}/diagrams`).then(diagramAdapter.mapFromDB),

  findProducts: (skillID) => fetch.get(`${SKILL_PATH}/${skillID}/products`).then(productAdapter.mapFromDB),

  findDisplays: (skillID) => fetch.get(`${DISPLAYS_PATH}?skill_id=${skillID}`).then(displayAdapter.mapFromDB),

  findAccountLinking: (skillID) => fetch.get(`link_account/template/${skillID}`),

  restore: (versionId) => fetch.post(`${SKILL_PATH}/${versionId}/restore`),
};

export default skillClient;
