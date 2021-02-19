import { AlexaVersionSettings, defaultAlexaVersionSettings, Locale, Voice } from '@voiceflow/alexa-types';
import { RepeatType } from '@voiceflow/general-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import { createErrorPromptAdapter, createRestartAdapter } from '../utils';
import accountLinkingAdapter from './accountLinking';

export type SkillSettings = Pick<
  FullSkill<Locale>['meta'],
  'repeat' | 'accountLinking' | 'alexaEvents' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'alexa_permissions'
>;

export const restartAdapter = createRestartAdapter<Voice>({ defaultVoice: Voice.ALEXA });
export const errorPromptAdapter = createErrorPromptAdapter<Voice>({ defaultVoice: Voice.ALEXA });

export const RepeatMap = {
  [RepeatType.ALL]: 100,
  [RepeatType.DIALOG]: 1,
  [RepeatType.OFF]: 0,
};

const alexaSettingsAdapter = createAdapter<AlexaVersionSettings, SkillSettings>(
  (settings) => {
    const {
      error,
      session,
      repeat,
      accountLinking,
      customInterface,
      events,
      permissions,
      modelSensitivity,
      defaultVoice,
    } = defaultAlexaVersionSettings(settings);

    return {
      repeat: RepeatMap[repeat],
      accountLinking: accountLinking && accountLinkingAdapter.fromDB(accountLinking),
      alexaEvents: events || '',
      settings: {
        defaultVoice,
        customInterface,
        modelSensitivity,
      },
      alexa_permissions: permissions,
      errorPrompt: errorPromptAdapter.fromDB(error),
      ...restartAdapter.fromDB(session),
    };
  },
  ({
    restart,
    repeat,
    settings: { customInterface = false, modelSensitivity = null, defaultVoice = null } = {},
    errorPrompt,
    alexaEvents,
    resumePrompt,
    accountLinking,
    alexa_permissions,
  }) => ({
    error: errorPromptAdapter.toDB(errorPrompt),
    repeat: (_invert(RepeatMap)[repeat] as RepeatType) || RepeatType.DIALOG,
    events: alexaEvents?.trim() || null,
    session: restartAdapter.toDB({ restart, resumePrompt }),
    permissions: alexa_permissions,
    defaultVoice: defaultVoice as Voice | null,
    accountLinking: accountLinking && accountLinkingAdapter.toDB(accountLinking),
    customInterface,
    modelSensitivity,
  })
);

export default alexaSettingsAdapter;
