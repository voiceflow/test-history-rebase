import { AccountLinking, DBDiagram, DBDisplay, DBProduct, DBSkill, ToDBSkill } from '@/models';

import diagramAdapter from './adapters/diagram';
import displayAdapter from './adapters/display';
import productAdapter from './adapters/product';
import fetch from './fetch';

export const SKILL_PATH = 'skill';
export const DISPLAYS_PATH = 'multimodal/displays';

const skillClient = {
  get: (skillID: string) => fetch.get<DBSkill>(`${SKILL_PATH}/${skillID}?simple=1&user_modules=1`),

  update: (skillID: string, body: Partial<ToDBSkill>) => fetch.patch(`${SKILL_PATH}/${skillID}`, body),

  updateInvName: (skillID: string, name: string) => fetch.patch(`${SKILL_PATH}/${skillID}?inv_name=1`, { inv_name: name }),

  updateAccountLinking: (skillID: string, body: AccountLinking) => fetch.post(`link_account/template/${skillID}`, body),

  findDiagrams: (skillID: string) => fetch.get<DBDiagram[]>(`${SKILL_PATH}/${skillID}/diagrams`).then(diagramAdapter.mapFromDB),

  findProducts: (skillID: string) => fetch.get<DBProduct[]>(`${SKILL_PATH}/${skillID}/products`).then(productAdapter.mapFromDB),

  findDisplays: (skillID: string) => fetch.get<DBDisplay[]>(`${DISPLAYS_PATH}?skill_id=${skillID}`).then(displayAdapter.mapFromDB),

  findAccountLinking: (skillID: string) => fetch.get<{ account_linking: AccountLinking }>(`link_account/template/${skillID}`),

  restore: (versionID: string) => fetch.post<{ skill_id: string; diagram: string }>(`${SKILL_PATH}/${versionID}/restore`),

  saveMetaData: (meta: any, skillID: string) => fetch.patch(`${SKILL_PATH}/${skillID}?publish=true`, meta),

  exportSkill: (versionID: string) => fetch.get<any>(`${SKILL_PATH}/${versionID}/export`),
};

export default skillClient;
