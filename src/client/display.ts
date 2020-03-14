import { DBDisplay } from '@/models';

import displayAdapter from './adapters/display';
import fetch from './fetch';

export const DISPLAY_PATH = 'multimodal/display';

export type DisplayPayload = Pick<DBDisplay, 'title' | 'datasource' | 'document'>;

const displayClient = {
  delete: (displayID: string) => fetch.delete(`${DISPLAY_PATH}/${displayID}`),

  getAll: () => fetch.get<DBDisplay[]>('multimodal/displays').then(displayAdapter.mapFromDB),

  get: (displayID: string) => fetch.get<DBDisplay>(`${DISPLAY_PATH}/${displayID}`).then(displayAdapter.fromDB),

  update: (displayID: string, skillID: string, data: Partial<DisplayPayload>) =>
    fetch.patch(`${DISPLAY_PATH}/${displayID}?skill_id=${skillID}`, data),

  create: (skillID: string, data: DisplayPayload) => fetch.post<string>(`${DISPLAY_PATH}?skill_id=${skillID}`, data),
};

export default displayClient;
