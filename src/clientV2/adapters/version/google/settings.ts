import { GoogleSettings, RepeatType, SessionType, Voice, defaultGoogleSettings } from '@voiceflow/google-types';
import _invert from 'lodash/invert';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

export type SkillSettings = Pick<
  FullSkill['meta'],
  'repeat' | 'accountLinking' | 'alexaEvents' | 'settings' | 'restart' | 'resumePrompt' | 'errorPrompt' | 'alexa_permissions'
>;

export const restartAdapter = createAdapter<GoogleSettings['session'], Pick<SkillSettings, 'restart' | 'resumePrompt'>>(
  (session) =>
    session.type === SessionType.RESUME
      ? {
          restart: false,
          resumePrompt: {
            voice: session.resume?.voice || Voice.DEFAULT,
            content: session.resume?.content || '',
            follow_voice: session.follow?.voice,
            follow_content: session.follow?.content,
          },
        }
      : {
          restart: true,
          resumePrompt: {
            voice: Voice.DEFAULT,
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

export const errorPromptAdapter = createAdapter<GoogleSettings['error'], SkillSettings['errorPrompt']>(
  (errorPrompt) => errorPrompt || { voice: Voice.DEFAULT, content: '' },
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

const googleSettingsAdapter = createAdapter<GoogleSettings, SkillSettings>(
  (settings) => {
    const { error, session, repeat } = defaultGoogleSettings(settings);
    return {
      repeat: RepeatMap[repeat],
      accountLinking: null,
      alexaEvents: '',
      settings: {},
      alexa_permissions: [],
      errorPrompt: errorPromptAdapter.fromDB(error),
      ...restartAdapter.fromDB(session),
    };
  },
  ({ resumePrompt, errorPrompt, restart, repeat }) => ({
    session: restartAdapter.toDB({ restart, resumePrompt }),
    error: errorPromptAdapter.toDB(errorPrompt),
    repeat: (_invert(RepeatMap)[repeat] as RepeatType) || RepeatType.DIALOG,
  })
);

export default googleSettingsAdapter;
