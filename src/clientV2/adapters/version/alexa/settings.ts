import { AlexaSettings, Voice, defaultAlexaSettings } from '@voiceflow/alexa-types';
import { RepeatType } from '@voiceflow/general-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import { createErrorPromptAdapter, createRestartAdapter } from '../utils';
import accountLinkingAdapter from './accountLinking';

export type SkillSettings = Pick<
  FullSkill['meta'],
  'repeat' | 'accountLinking' | 'alexaEvents' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'alexa_permissions'
>;

export const restartAdapter = createRestartAdapter<Voice>({ defaultVoice: Voice.ALEXA });
export const errorPromptAdapter = createErrorPromptAdapter<Voice>({ defaultVoice: Voice.ALEXA });

export const RepeatMap = {
  [RepeatType.ALL]: 100,
  [RepeatType.DIALOG]: 1,
  [RepeatType.OFF]: 0,
};

const alexaSettingsAdapter = createAdapter<AlexaSettings, SkillSettings>(
  (settings) => {
    const { error, session, repeat, accountLinking, customInterface, events, permissions } = defaultAlexaSettings(settings);
    return {
      repeat: RepeatMap[repeat],
      accountLinking: accountLinking && accountLinkingAdapter.fromDB(accountLinking),
      alexaEvents: events || '',
      settings: {
        customInterface,
      },
      alexa_permissions: permissions,
      errorPrompt: errorPromptAdapter.fromDB(error),
      ...restartAdapter.fromDB(session),
    };
  },
  ({ resumePrompt, errorPrompt, restart, repeat, accountLinking, alexaEvents, alexa_permissions, settings: { customInterface = false } = {} }) => ({
    session: restartAdapter.toDB({ restart, resumePrompt }),
    error: errorPromptAdapter.toDB(errorPrompt),
    repeat: (_invert(RepeatMap)[repeat] as RepeatType) || RepeatType.DIALOG,
    accountLinking: accountLinking && accountLinkingAdapter.toDB(accountLinking),
    events: alexaEvents?.trim() || null,
    customInterface,
    permissions: alexa_permissions,
  })
);

export default alexaSettingsAdapter;
