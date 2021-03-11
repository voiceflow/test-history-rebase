import { defaultGeneralVersionSettings, GeneralVersionSettings, Locale, RepeatType, Voice } from '@voiceflow/general-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import { createErrorPromptAdapter, createRestartAdapter } from '../utils';

export type GeneralSkillSettings = Pick<FullSkill<string>['meta'], 'repeat' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'locales'>;

export const restartAdapter = createRestartAdapter<Voice>({ defaultVoice: Voice.DEFAULT });
export const errorPromptAdapter = createErrorPromptAdapter<Voice>({ defaultVoice: Voice.DEFAULT });

export const RepeatMap = {
  [RepeatType.ALL]: 100,
  [RepeatType.DIALOG]: 1,
  [RepeatType.OFF]: 0,
};

const generalSettingsAdapter = createAdapter<GeneralVersionSettings, GeneralSkillSettings>(
  (settings) => {
    const { error, session, repeat, locales, defaultVoice } = defaultGeneralVersionSettings(settings);
    return {
      repeat: RepeatMap[repeat],
      locales,
      accountLinking: null,
      alexaEvents: '',
      settings: { defaultVoice },
      alexa_permissions: [],
      errorPrompt: errorPromptAdapter.fromDB(error),
      ...restartAdapter.fromDB(session),
    };
  },
  ({ locales = [Locale.EN_US], resumePrompt, errorPrompt, restart, repeat, settings: { defaultVoice = null } = {} }) => ({
    locales: locales as Locale[],
    session: restartAdapter.toDB({ restart, resumePrompt }),
    error: errorPromptAdapter.toDB(errorPrompt),
    repeat: (_invert(RepeatMap)[repeat] as RepeatType) || RepeatType.DIALOG,
    defaultVoice: defaultVoice as Voice | null,
  })
);

export default generalSettingsAdapter;
