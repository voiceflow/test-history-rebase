import { GeneralRequest } from '@voiceflow/general-types';
import axios from 'axios';

import legacySkillAdapter, { extractIntents, extractSlots } from '@/client/adapters/legacy/skill';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import { PrototypeLayout } from '@/ducks/prototype/types';
import { PrototypeContext } from '@/models';

import { api } from './fetch';

export const LEGACY_TESTING_PATH = 'test';
export const PROTOTYPE_PATH = 'prototype';

const prototypeClient = {
  interact: (versionID: string, body: { state: Omit<PrototypeContext, 'trace'>; request: GeneralRequest }) =>
    axios
      .post<{ state: PrototypeContext; trace: PrototypeContext['trace'] }>(`${GENERAL_RUNTIME_ENDPOINT}/interact/${versionID}`, body)
      .then(({ data }) => data),

  getLegacyInfo: (configID: string) =>
    api.get(`${LEGACY_TESTING_PATH}/getInfo/${configID}`).then((data: any) => {
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
        settings: {
          layout: PrototypeLayout.TEXT_DIALOG,
          avatar: undefined,
          brandColor: undefined,
          branchImage: undefined,
        },
      };
    }),
};

export default prototypeClient;
