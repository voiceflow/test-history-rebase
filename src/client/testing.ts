import skillAdapter, { extractIntents, extractSlots } from '@/client/adapters/skill';

import fetch from './fetch';

export const TESTING_PATH = 'test';

const testingClient = {
  render: (diagramID: string, meta: object) => fetch.post(`diagram/${diagramID}/test/publish`, meta),

  interact: (body: object) => fetch.post(`${TESTING_PATH}/interact`, body),

  createInfo: (skillID: string, diagramID: string, globals: object) =>
    fetch.post(`${TESTING_PATH}/makeInfo/${skillID}`, { diagram: diagramID, globals }, { cache: true, expiry: false }),

  getInfo: (configID: string) =>
    fetch.get(`${TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
      const skill = skillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill);
      const slots = extractSlots(data.skill);

      return { skill, intents, slots, testVariableValues: data.globals };
    }),

  getSpeakAudio: ({ ssml, voice }: { ssml: string; voice: string }) => fetch.post<string>(`${TESTING_PATH}/speak`, { ssml, voice }),

  entityExtract: ({ input, intent, slots, curSlot }: any) => fetch.post(`${TESTING_PATH}/entity_extract`, { input, intent, slots, curSlot }),
};

export default testingClient;
