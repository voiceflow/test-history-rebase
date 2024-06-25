import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';
import { createSimpleAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';

export type DBSession<Prompt = unknown> = Nullable<BaseVersion.Session<Prompt>>;
export type FromAndToDBOptions = [{ defaultVoice: string }];

export const simple = createSimpleAdapter<DBSession, Models.Version.Session, FromAndToDBOptions, FromAndToDBOptions>(
  (session) =>
    session?.type === BaseVersion.SessionType.RESUME
      ? { restart: false, resumePrompt: null }
      : { restart: true, resumePrompt: null },
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

export const CONFIG = {
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
