import { Version } from '@realtime-sdk/models';
import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

const createSessionAdapter = <V extends string>({
  type,
  platform,
}: {
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
}) =>
  createMultiAdapter<
    BaseVersion.RestartSession | BaseVersion.ResumeSession<VoiceModels.Prompt<V>>,
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

      return {
        type: BaseVersion.SessionType.RESUME,
        resume: content?.trim()
          ? {
              voice: (voice as V) || defaultVoice || (Platform.Config.getTypeConfig(platform, type).project.voice.default as V),
              content,
            }
          : null,
        follow: followContent?.trim()
          ? {
              voice: (followVoice as V) || defaultVoice || (Platform.Config.getTypeConfig(platform, type).project.voice.default as V),
              content: followContent,
            }
          : null,
      };
    }
  );

export default createSessionAdapter;
