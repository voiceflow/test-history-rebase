import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { ChatModels } from '@voiceflow/chat-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Prompt from '../prompt';

export type DBSession = Base.Adapters.Version.Session.DBSession<ChatModels.Prompt>;

export const simple = createSimpleAdapter<DBSession, Models.Version.Session>(
  (session) => ({
    ...Base.Adapters.Version.Session.simple.fromDB(session, { defaultVoice: VoiceflowConstants.Voice.DEFAULT }),
    resumePrompt:
      session?.type === BaseVersion.SessionType.RESUME
        ? {
            resume: Prompt.simple.fromDB(session.resume ?? Prompt.promptFactory()),
            follow: Prompt.simple.fromDB(session.follow ?? Prompt.promptFactory()),
          }
        : { resume: Prompt.promptFactory(), follow: Prompt.promptFactory() },
  }),

  (session) => {
    const baseSession = Base.Adapters.Version.Session.simple.toDB(session, { defaultVoice: VoiceflowConstants.Voice.DEFAULT });

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
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
