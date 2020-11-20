import { Prompt, RestartSession, ResumeSession, SessionType } from '@voiceflow/general-types';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

export const createRestartAdapter = <V extends string>({ defaultVoice }: { defaultVoice: V }) =>
  createAdapter<RestartSession | ResumeSession<V>, Pick<FullSkill<string>['meta'], 'restart' | 'resumePrompt'>>(
    (session) =>
      session.type === SessionType.RESUME
        ? {
            restart: false,
            resumePrompt: {
              voice: session.resume?.voice || defaultVoice,
              content: session.resume?.content || '',
              follow_voice: session.follow?.voice,
              follow_content: session.follow?.content,
            },
          }
        : {
            restart: true,
            resumePrompt: {
              voice: defaultVoice,
              content: '',
            },
          },
    ({ restart, resumePrompt = {} }) => {
      const { voice, content, follow_content, follow_voice } = resumePrompt;

      if (restart) {
        return {
          type: SessionType.RESTART,
        };
      }

      return {
        type: SessionType.RESUME,
        resume:
          voice && content?.trim()
            ? {
                voice: voice as V,
                content,
              }
            : null,
        follow:
          follow_content?.trim() && follow_voice
            ? {
                voice: follow_voice as V,
                content: follow_content,
              }
            : null,
      };
    }
  );

export const createErrorPromptAdapter = <V extends string>({ defaultVoice }: { defaultVoice: V }) =>
  createAdapter<null | Prompt<V>, FullSkill<string>['meta']['errorPrompt']>(
    (errorPrompt) => errorPrompt || { voice: defaultVoice, content: '' },
    (errorPrompt) =>
      errorPrompt?.voice && errorPrompt?.content?.trim()
        ? {
            voice: errorPrompt.voice as V,
            content: errorPrompt.content,
          }
        : null
  );
