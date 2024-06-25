import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import type { ChatModels } from '@voiceflow/chat-types';
import { createSimpleAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';
import * as Prompt from '../prompt';

export type DBSession = Base.Adapters.Version.Session.DBSession<ChatModels.Prompt>;
export type FromAndToDBOptions = Base.Adapters.Version.Session.FromAndToDBOptions;

export const simple = createSimpleAdapter<DBSession, Models.Version.Session, FromAndToDBOptions, FromAndToDBOptions>(
  (session, options) => ({
    ...Base.Adapters.Version.Session.simple.fromDB(session, options),
    resumePrompt:
      session?.type === BaseVersion.SessionType.RESUME
        ? {
            resume: Prompt.simple.fromDB(session.resume ?? Prompt.promptFactory()),
            follow: Prompt.simple.fromDB(session.follow ?? Prompt.promptFactory()),
          }
        : { resume: Prompt.promptFactory(), follow: Prompt.promptFactory() },
  }),

  (session, options) => {
    const baseSession = Base.Adapters.Version.Session.simple.toDB(session, options);

    if (baseSession?.type === BaseVersion.SessionType.RESTART) {
      return baseSession;
    }

    return {
      ...session.resumePrompt,
      type: BaseVersion.SessionType.RESUME,
    };
  }
);

export const CONFIG = Base.Adapters.Version.Session.extend({
  simple,
})(Base.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
