import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { VoiceVersion } from '@voiceflow/voice-types';
import { createSimpleAdapter, createSmartSimpleAdapter, SimpleAdapter, SmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Prompt from '../prompt';

export type FromAndToDBOptions = Base.Adapters.Version.Settings.FromAndToDBOptions;

export const smart = createSmartSimpleAdapter<
  Omit<VoiceVersion.Settings<string>, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  ({ error, globalNoMatch, globalNoReply, ...dbSettings }, { defaultVoice }) => ({
    ...Base.Adapters.Version.Settings.smart.fromDB(dbSettings, { defaultVoice: dbSettings.defaultVoice ?? defaultVoice }),
    ...(ConfigUtils.hasValue(dbSettings, 'defaultVoice') && { defaultVoice: dbSettings.defaultVoice ?? defaultVoice }),
    ...(error !== undefined && { error: error && Prompt.simple.fromDB(error) }),
    ...(globalNoMatch &&
      globalNoMatch.type !== BaseVersion.GlobalNoMatchType.GENERATIVE && {
        globalNoMatch: { ...globalNoMatch, prompt: globalNoMatch.prompt && Prompt.simple.fromDB(globalNoMatch.prompt) },
      }),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.fromDB(globalNoReply.prompt) },
    }),
  }),
  ({ error, globalNoMatch, globalNoReply, ...settings }, { defaultVoice }) => ({
    ...Base.Adapters.Version.Settings.smart.toDB(settings, { defaultVoice: settings.defaultVoice ?? defaultVoice }),
    ...(ConfigUtils.hasValue(settings, 'defaultVoice') && { defaultVoice: settings.defaultVoice }),
    ...(error !== undefined && { error: error && Prompt.simple.toDB(error) }),
    ...(globalNoMatch &&
      globalNoMatch.type !== BaseVersion.GlobalNoMatchType.GENERATIVE && {
        globalNoMatch: { type: globalNoMatch.type, prompt: globalNoMatch.prompt && Prompt.simple.toDB(globalNoMatch.prompt) },
      }),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.toDB(globalNoReply.prompt) },
    }),
  })
);

export const simple = createSimpleAdapter<
  Omit<VoiceVersion.Settings<string>, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbSettings, options) =>
    smart.fromDB(VoiceVersion.defaultSettings(dbSettings, { defaultPromptVoice: dbSettings.defaultVoice ?? options.defaultVoice }), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Base.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Base.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const smartFactory = <Voice extends string>() =>
  smart as unknown as SmartSimpleAdapter<
    Omit<VoiceVersion.Settings<Voice>, 'session'>,
    Models.Version.Settings.Model<Voice>,
    Base.Adapters.Version.Settings.FromAndToDBOptions,
    Base.Adapters.Version.Settings.FromAndToDBOptions
  >;

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() =>
  simple as unknown as SimpleAdapter<
    Omit<VoiceVersion.Settings<Voice>, 'session'>,
    Models.Version.Settings.Model<Voice>,
    Base.Adapters.Version.Settings.FromAndToDBOptions,
    Base.Adapters.Version.Settings.FromAndToDBOptions
  >;
