import fetch from './fetch';

const DISPLAY_PATH = 'multimodal/display';

const displayClient = {
  delete: (displayID) => fetch.delete(`${DISPLAY_PATH}/${displayID}`),
};

export default displayClient;
