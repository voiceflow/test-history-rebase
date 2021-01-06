import { RepeatType } from '@voiceflow/general-types';
import { GoogleVersionSettings, Locale, Voice, defaultGoogleVersionSettings } from '@voiceflow/google-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import { createErrorPromptAdapter, createRestartAdapter } from '../utils';

export type SkillSettings = Pick<
  FullSkill<Locale>['meta'],
  'repeat' | 'accountLinking' | 'alexaEvents' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'alexa_permissions'
>;

export const restartAdapter = createRestartAdapter<Voice>({ defaultVoice: Voice.DEFAULT });
export const errorPromptAdapter = createErrorPromptAdapter<Voice>({ defaultVoice: Voice.DEFAULT });

export const RepeatMap = {
  [RepeatType.ALL]: 100,
  [RepeatType.DIALOG]: 1,
  [RepeatType.OFF]: 0,
};

const googleSettingsAdapter = createAdapter<GoogleVersionSettings, SkillSettings>(
  (settings) => {
    const { error, session, repeat, defaultVoice } = defaultGoogleVersionSettings(settings);
    return {
      repeat: RepeatMap[repeat],
      accountLinking: null,
      alexaEvents: '',
      settings: {
        defaultVoice,
      },
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

export default googleSettingsAdapter;
