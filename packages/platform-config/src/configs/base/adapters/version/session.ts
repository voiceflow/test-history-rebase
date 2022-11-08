import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { createSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export type DBSession<Prompt = unknown> = Nullable<BaseVersion.Session<Prompt>>;
export type FromAndToDBOptions = [{ defaultVoice: string }];

export const simple = createSimpleAdapter<DBSession, Models.Version.Session, FromAndToDBOptions, FromAndToDBOptions>(
  (session) => (session?.type === BaseVersion.SessionType.RESUME ? { restart: false, resumePrompt: null } : { restart: true, resumePrompt: null }),
  ({ restart }) => {
    if (restart) {
      return { type: BaseVersion.SessionType.RESTART };
    }

    return {
      type: BaseVersion.SessionType.RESUME,
      resume: null,
      follow: null,
    };
  }
);
