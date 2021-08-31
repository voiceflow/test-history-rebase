import { Version as BaseVersion } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import { Adapters } from '@voiceflow/realtime-sdk';
import { Types as VoiceTypes } from '@voiceflow/voice-types';

import { Version } from '@/models';
import { Nullable } from '@/types';
import { getPlatformDefaultVoice } from '@/utils/platform';

const createSessionAdapter = <V extends string>({ platform }: { platform: PlatformType }) =>
  Adapters.createAdapter<
    BaseVersion.RestartSession | BaseVersion.ResumeSession<VoiceTypes.Prompt<V>>,
    Nullable<Version.Session>,
    [{ defaultVoice: Nullable<V> }],
    [{ defaultVoice: Nullable<V> }]
  >(
    (session, { defaultVoice }) =>
      session?.type === BaseVersion.SessionType.RESUME
        ? {
            restart: false,
            resumePrompt: {
              voice: session.resume?.voice || defaultVoice || null,
              content: session.resume?.content || '',
              followVoice: session.follow?.voice ?? null,
              followContent: session.follow?.content ?? null,
            },
          }
        : {
            restart: true,
            resumePrompt: {
              voice: defaultVoice || null,
              content: '',
              followVoice: null,
              followContent: null,
            },
          },
    (session, { defaultVoice }) => {
      const { restart, resumePrompt } = session ?? { resumePrompt: { voice: null, content: '', followContent: '', followVoice: '' } };
      const { voice, content, followContent, followVoice } = resumePrompt;

      if (restart) {
        return {
          type: BaseVersion.SessionType.RESTART,
        };
      }

      const platformDefaultVoice = getPlatformDefaultVoice(platform);

      return {
        type: BaseVersion.SessionType.RESUME,
        resume: content?.trim()
          ? {
              voice: (voice as V) || defaultVoice || (platformDefaultVoice as V),
              content,
            }
          : null,
        follow: followContent?.trim()
          ? {
              voice: (followVoice as V) || defaultVoice || (platformDefaultVoice as V),
              content: followContent,
            }
          : null,
      };
    }
  );

export default createSessionAdapter;
