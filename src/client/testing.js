import skillAdapter from '@/client/adapters/skill';

import fetch from './fetch';

const TESTING_PATH = 'test';

const testingClient = {
  render: (diagramID, meta) => fetch.post(`diagram/${diagramID}/test/publish`, meta),

  interact: (state) => fetch.post(`${TESTING_PATH}/interact`, state),

  createInfo: (skillID, diagramID, globals) => fetch.post(`${TESTING_PATH}/makeInfo/${skillID}`, { diagram: diagramID, globals }),

  getInfo: (configID) =>
    fetch(`${TESTING_PATH}/getInfo/${configID}`).then((body) => {
      body.skill = skillAdapter.fromDB(body.skill);
      return body;
    }),
};

export default testingClient;
