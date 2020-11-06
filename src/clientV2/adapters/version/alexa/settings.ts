import { AlexaSettings, RepeatType, SessionType, Voice, defaultAlexaSettings } from '@voiceflow/alexa-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

import accountLinkingAdapter from './accountLinking';

export type SkillSettings = Pick<
  FullSkill['meta'],
  'repeat' | 'accountLinking' | 'alexaEvents' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'alexa_permissions'
>;

export const restartAdapter = createAdapter<AlexaSettings['session'], Pick<SkillSettings, 'restart' | 'resumePrompt'>>(
  (session) =>
    session.type === SessionType.RESUME
      ? {
          restart: false,
          resumePrompt: {
            voice: session.resume?.voice || Voice.ALEXA,
            content: session.resume?.content || '',
            follow_voice: session.follow?.voice,
            follow_content: session.follow?.content,
          },
        }
      : {
          restart: true,
          resumePrompt: {
            voice: Voice.ALEXA,
            content: '',
          },
        },
  ({ restart, resumePrompt = {} }) => {
    if (restart)
      return {
        type: SessionType.RESTART,
      };
    const { voice, content, follow_content, follow_voice } = resumePrompt;
    return {
      type: SessionType.RESUME,
      resume:
        voice && content?.trim()
          ? {
              voice: voice as Voice,
              content,
            }
          : null,
      follow:
        follow_content?.trim() && follow_voice
          ? {
              voice: follow_voice as Voice,
              content: follow_content,
            }
          : null,
    };
  }
);

export const errorPromptAdapter = createAdapter<AlexaSettings['error'], SkillSettings['errorPrompt']>(
  (errorPrompt) => errorPrompt || { voice: Voice.ALEXA, content: '' },
  (errorPrompt) =>
    errorPrompt?.voice && errorPrompt?.content?.trim()
      ? {
          voice: errorPrompt.voice as Voice,
          content: errorPrompt.content,
        }
      : null
);

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
