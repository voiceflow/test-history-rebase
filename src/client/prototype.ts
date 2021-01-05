import { GeneralRequest } from '@voiceflow/general-types';
import axios from 'axios';

import legacySkillAdapter, { extractIntents, extractSlots } from '@/client/adapters/legacy/skill';
import { API_ENDPOINT, GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { PrototypeContext, StateRequest } from '@/models';

import fetch from './fetch';

export const LEGACY_TESTING_PATH = 'test';
export const PROTOTYPE_PATH = 'prototype';

const prototypeClient = {
  interact: (body: { state: Omit<PrototypeContext, 'trace'>; request?: StateRequest }, locale: string) =>
    fetch.post<PrototypeContext>(`${PROTOTYPE_PATH}/interact?locale=${locale}`, body),

  interactV2: (versionID: string, body: { state: Omit<PrototypeContext, 'trace'>; request: GeneralRequest }) =>
    axios
      .post<{ state: PrototypeContext; trace: PrototypeContext['trace'] }>(`${GENERAL_RUNTIME_ENDPOINT}/interact/${versionID}`, body)
      .then(({ data }) => data),

  getInfo: (configID: string) =>
    fetch.get(`${LEGACY_TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
      const skill = legacySkillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill);
      const slots = extractSlots(data.skill);

      return { skill, intents, slots, testVariableValues: data.globals };
    }),

  getLegacyInfo: (configID: string) =>
    fetch.get(`${LEGACY_TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
      const skill = legacySkillAdapter.fromDB(data.skill);
      const intents = extractIntents(data.skill) as any[];
      const slots = extractSlots(data.skill) as any[];

      return {
        data: {
          name: skill.name,
          locales: skill.locales || ['en-US'],
        },
        context: {
          stack: [{ programID: skill.rootDiagramID }],
          variables: (data.globals as Record<string, unknown>) || {},
        },
        model: {
          slots,
          intents,
        },
      };
    }),

  createInfo: (versionID: string, diagramID: string, variables: Record<string, any>) =>
    axios.post(`${API_ENDPOINT}/v2/versions/${versionID}/test`, { diagramID, variables }).then((res) => res.data as string),

  getSpeakAudio: ({ ssml, voice }: { ssml: string; voice: string }) => fetch.post<string>(`${LEGACY_TESTING_PATH}/speak`, { ssml, voice }),
};

export default prototypeClient;
