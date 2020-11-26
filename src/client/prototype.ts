import axios from 'axios';

import legacySkillAdapter, { extractIntents, extractSlots } from '@/client/adapters/legacy/skill';
import { API_ENDPOINT } from '@/config';
import { PrototypeContext, StateRequest } from '@/models';

import fetch from './fetch';

export const LEGACY_TESTING_PATH = 'test';
export const PROTOTYPE_PATH = 'prototype';

const prototypeClient = {
  interact: (body: { state: Omit<PrototypeContext, 'trace'>; request?: StateRequest }, locale: string) =>
    fetch.post<PrototypeContext>(`${PROTOTYPE_PATH}/interact?locale=${locale}`, body),

  getInfo: (configID: string) =>
    fetch.get(`${LEGACY_TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
      const skill = legacySkillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill);
      const slots = extractSlots(data.skill);

      return { skill, intents, slots, testVariableValues: data.globals };
    }),

  createInfo: (versionID: string, diagramID: string, variables: Record<string, any>) =>
    axios.post(`${API_ENDPOINT}/v2/versions/${versionID}/test`, { diagramID, variables }).then((res) => res.data as string),

  getSpeakAudio: ({ ssml, voice }: { ssml: string; voice: string }) => fetch.post<string>(`${LEGACY_TESTING_PATH}/speak`, { ssml, voice }),
};

export default prototypeClient;
