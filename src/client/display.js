import fetch from './fetch';

export const DISPLAY_PATH = 'multimodal/display';

const displayClient = {
  delete: (displayID) => fetch.delete(`${DISPLAY_PATH}/${displayID}`),
  getAll: () => fetch.get('multimodal/displays'),
  get: (displayID) => fetch.get(`${DISPLAY_PATH}/${displayID}`),
  update: (displayID, skillId, data) => fetch.patch(`${DISPLAY_PATH}/${displayID}?skill_id=${skillId}`, data),
  create: (skillId, data) => fetch.post(`${DISPLAY_PATH}?skill_id=${skillId}`, data),
};

export default displayClient;
