import { GeneralSettings, RepeatType, Voice, defaultGeneralSettings } from '@voiceflow/general-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import { createErrorPromptAdapter, createRestartAdapter } from '../utils';

export type SkillSettings = Pick<FullSkill<string>['meta'], 'repeat' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt'>;

export const restartAdapter = createRestartAdapter<Voice>({ defaultVoice: Voice.DEFAULT });
export const errorPromptAdapter = createErrorPromptAdapter<Voice>({ defaultVoice: Voice.DEFAULT });

export const RepeatMap = {
  [RepeatType.ALL]: 100,
  [RepeatType.DIALOG]: 1,
  [RepeatType.OFF]: 0,
};

const generalSettingsAdapter = createAdapter<GeneralSettings<Voice>, SkillSettings>(
  (settings) => {
    const { error, session, repeat, defaultVoice } = defaultGeneralSettings(settings, { defaultPromptVoice: Voice.DEFAULT });

    return {
      repeat: RepeatMap[repeat],
      accountLinking: null,
      alexaEvents: '',
      settings: { defaultVoice },
      alexa_permissions: [],
      errorPrompt: errorPromptAdapter.fromDB(error),
      ...restartAdapter.fromDB(session),
    };
  },
  ({ resumePrompt, errorPrompt, restart, repeat, settings: { defaultVoice = null } = {} }) => ({
    session: restartAdapter.toDB({ restart, resumePrompt }),
    error: errorPromptAdapter.toDB(errorPrompt),
    repeat: (_invert(RepeatMap)[repeat] as RepeatType) || RepeatType.DIALOG,
    defaultVoice: defaultVoice as Voice | null,
  })
);

export default generalSettingsAdapter;
