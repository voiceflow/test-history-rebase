import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export type Session = Nullable<Models.Version.Session>;
export type DBSession = BaseVersion.RestartSession | BaseVersion.ResumeSession<VoiceModels.Prompt<string>>;
export type FromToDBArgs = [{ defaultVoice: string }];

export const simple = createMultiAdapter<DBSession, Session, FromToDBArgs, FromToDBArgs>(
  (session, { defaultVoice }) =>
    session?.type === BaseVersion.SessionType.RESUME
      ? {
          restart: false,
          resumePrompt: {
            voice: session.resume?.voice || defaultVoice,
            content: session.resume?.content || '',
            followVoice: session.follow?.voice ?? null,
            followContent: session.follow?.content ?? null,
          },
        }
      : {
          restart: true,
          resumePrompt: {
            voice: defaultVoice,
            content: '',
            followVoice: null,
            followContent: null,
          },
        },
  (session, { defaultVoice }) => {
    const { restart, resumePrompt } = session ?? { resumePrompt: { voice: null, content: '', followContent: '', followVoice: '' } };
    const { voice, content, followContent, followVoice } = resumePrompt;

    if (restart) {
      return { type: BaseVersion.SessionType.RESTART };
    }

    return {
      type: BaseVersion.SessionType.RESUME,
      resume: content?.trim() ? { voice: voice || defaultVoice, content } : null,
      follow: followContent?.trim() ? { voice: followVoice || defaultVoice, content: followContent } : null,
    };
  }
);
