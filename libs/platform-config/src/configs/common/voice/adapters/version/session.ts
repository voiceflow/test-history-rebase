import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import type { VoiceModels } from '@voiceflow/voice-types';
import type { SimpleAdapter } from 'bidirectional-adapter';
import { createSimpleAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';

export type DBSession<Voice extends string = string> = Base.Adapters.Version.Session.DBSession<
  VoiceModels.Prompt<Voice>
>;
export type FromAndToDBOptions = Base.Adapters.Version.Session.FromAndToDBOptions;

export const simple = createSimpleAdapter<DBSession, Models.Version.Session, FromAndToDBOptions, FromAndToDBOptions>(
  (session, { defaultVoice }) => ({
    ...Base.Adapters.Version.Session.simple.fromDB(session, { defaultVoice }),
    resumePrompt:
      session?.type === BaseVersion.SessionType.RESUME
        ? {
            voice: session.resume?.voice || defaultVoice,
            content: session.resume?.content || '',
            followVoice: session.follow?.voice || defaultVoice,
            followContent: session.follow?.content ?? null,
          }
        : {
            voice: defaultVoice,
            content: '',
            followVoice: defaultVoice,
            followContent: null,
          },
  }),

  (session, { defaultVoice }) => {
    const baseSession = Base.Adapters.Version.Session.simple.toDB(session, { defaultVoice });

    if (baseSession?.type === BaseVersion.SessionType.RESTART) {
      return baseSession;
    }

    const {
      resumePrompt: { content, voice, followContent, followVoice },
    } = session;

    return {
      type: BaseVersion.SessionType.RESUME,
      resume: content?.trim() ? { voice: voice || defaultVoice || '', content } : null,
      follow: followContent?.trim() ? { voice: followVoice || defaultVoice || '', content: followContent } : null,
    };
  }
);

export const CONFIG = Base.Adapters.Version.Session.extend({
  simple,
})(Base.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() =>
  simple as unknown as SimpleAdapter<
    DBSession<Voice>,
    Models.Version.Session<Voice>,
    FromAndToDBOptions,
    FromAndToDBOptions
  >;
