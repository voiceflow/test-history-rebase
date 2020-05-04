import skillAdapter, { extractIntents, extractSlots } from '@/client/adapters/skill';

import fetch from './fetch';

export const LEGACY_TESTING_PATH = 'test';
export const PROTOTYPE_PATH = 'prototype';

const prototypeClient = {
  render: (diagramID: string, meta: object) => fetch.post(`diagram/${diagramID}/test/publish`, meta),

  interact: (body: object, locale: string) => fetch.post<object>(`${PROTOTYPE_PATH}/interact?locale=${locale}`, body),

  createInfo: (skillID: string, diagramID: string, globals: object) =>
    fetch.post(`${LEGACY_TESTING_PATH}/makeInfo/${skillID}`, { diagram: diagramID, globals }, { cache: true, expiry: false }),

  getInfo: (configID: string) =>
    fetch.get(`${LEGACY_TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
      const skill = skillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill);
      const slots = extractSlots(data.skill);

      return { skill, intents, slots, testVariableValues: data.globals };
    }),

  getSpeakAudio: ({ ssml, voice }: { ssml: string; voice: string }) => fetch.post<string>(`${LEGACY_TESTING_PATH}/speak`, { ssml, voice }),

  entityExtract: ({ input, intent, slots, curSlot }: any) => fetch.post(`${LEGACY_TESTING_PATH}/entity_extract`, { input, intent, slots, curSlot }),
};

export default prototypeClient;
