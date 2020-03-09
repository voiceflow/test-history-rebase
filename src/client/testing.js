import skillAdapter, { extractIntents, extractSlots } from '@/client/adapters/skill';

import fetch from './fetch';

const TESTING_PATH = 'test';

const testingClient = {
  render: (diagramID, meta) => fetch.post(`diagram/${diagramID}/test/publish`, meta),

  interact: (state) => fetch.post(`${TESTING_PATH}/interact`, state),

  createInfo: (skillID, diagramID, globals) =>
    fetch.post(`${TESTING_PATH}/makeInfo/${skillID}`, { diagram: diagramID, globals }, { cache: true, expiry: false }),

  getInfo: (configID) =>
    fetch.get(`${TESTING_PATH}/getInfo/${configID}`).then((data) => {
      const skill = skillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill);
      const slots = extractSlots(data.skill);
      return { skill, intents, slots, testVariableValues: data.globals };
    }),

  getSpeakAudio: ({ ssml, voice }) => fetch.post(`${TESTING_PATH}/speak`, { ssml, voice }),

  entityExtract: ({ input, intent, slots, curSlot }) => fetch.post(`${TESTING_PATH}/entity_extract`, { input, intent, slots, curSlot }),
};

export default testingClient;
