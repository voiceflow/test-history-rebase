import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { ChatVersion } from '@voiceflow/chat-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Prompt from '../prompt';

export type FromAndToDBOptions = Base.Adapters.Version.Settings.FromAndToDBOptions;

const PLATFORM_ONLY_FILES = Types.satisfies<keyof ChatVersion.Settings>()(['messageDelay']);

export const smart = createSmartSimpleAdapter<
  Omit<ChatVersion.Settings, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  ({ error, globalNoMatch, globalNoReply, ...dbSettings }, options) => ({
    ...Base.Adapters.Version.Settings.smart.fromDB(dbSettings, options),
    ...ConfigUtils.pickNonEmptyFields(dbSettings, PLATFORM_ONLY_FILES),
    ...(error !== undefined && { error: error && Prompt.simple.fromDB(error) }),
    ...(globalNoMatch &&
      (globalNoMatch.type === BaseVersion.GlobalNoMatchType.GENERATIVE
        ? {
            globalNoMatch: { type: BaseVersion.GlobalNoMatchType.GENERATIVE, prompt: globalNoMatch.prompt },
          }
        : {
            globalNoMatch: { type: BaseVersion.GlobalNoMatchType.STATIC, prompt: globalNoMatch.prompt && Prompt.simple.fromDB(globalNoMatch.prompt) },
          })),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.fromDB(globalNoReply.prompt) },
    }),
  }),
  ({ error, globalNoMatch, globalNoReply, ...settings }, options) => ({
    ...Base.Adapters.Version.Settings.smart.toDB(settings, options),
    ...ConfigUtils.pickNonEmptyFields(settings, PLATFORM_ONLY_FILES),
    ...(error !== undefined && { error: error && Prompt.simple.toDB(error) }),
    ...(globalNoMatch?.type === BaseVersion.GlobalNoMatchType.STATIC && {
      globalNoMatch: { type: globalNoMatch.type, prompt: globalNoMatch.prompt && Prompt.simple.toDB(globalNoMatch.prompt) },
    }),
    ...(globalNoMatch?.type === BaseVersion.GlobalNoMatchType.GENERATIVE && {
      globalNoMatch,
    }),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.toDB(globalNoReply.prompt) },
    }),
  })
);

export const simple = createSimpleAdapter<
  Omit<ChatVersion.Settings, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(ChatVersion.defaultSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Base.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Base.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
