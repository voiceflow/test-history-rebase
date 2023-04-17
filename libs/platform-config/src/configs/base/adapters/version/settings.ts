import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Prompt from '../prompt';

export type FromAndToDBOptions = [{ defaultVoice: string }];

const SHARED_FIELDS = Types.satisfies<keyof BaseVersion.Settings>()([
  'repeat',
  'defaultCarouselLayout',
  'defaultCarouselLayout',
  'defaultCanvasNodeVisibility',
]);

export const smart = createSmartSimpleAdapter<
  Omit<BaseVersion.Settings, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbSettings) => ({
    ...ConfigUtils.pickNonEmptyFields(dbSettings, SHARED_FIELDS),
    ...(ConfigUtils.hasValue(dbSettings, 'error') && { error: dbSettings.error === null ? null : Prompt.simple.fromDB(dbSettings.error) }),
    ...(ConfigUtils.hasValue(dbSettings, 'globalNoMatch') && {
      globalNoMatch: {
        ...dbSettings.globalNoMatch,
        prompt: dbSettings.globalNoMatch.prompt != null ? Prompt.simple.fromDB(dbSettings.globalNoMatch.prompt) : dbSettings.globalNoMatch.prompt,
      },
    }),
    ...(ConfigUtils.hasValue(dbSettings, 'globalNoReply') && {
      globalNoReply: {
        ...dbSettings.globalNoReply,
        prompt: dbSettings.globalNoReply.prompt != null ? Prompt.simple.fromDB(dbSettings.globalNoReply.prompt) : dbSettings.globalNoReply.prompt,
      },
    }),
  }),
  (settings) => ({
    ...ConfigUtils.pickNonEmptyFields(settings, SHARED_FIELDS),
    ...(ConfigUtils.hasValue(settings, 'error') && { error: settings.error && Prompt.simple.toDB(settings.error) }),
    ...(ConfigUtils.hasValue(settings, 'globalNoMatch') && {
      globalNoMatch: {
        ...settings.globalNoMatch,
        prompt: settings.globalNoMatch.prompt && Prompt.simple.toDB(settings.globalNoMatch.prompt),
      },
    }),
    ...(ConfigUtils.hasValue(settings, 'globalNoReply') && {
      globalNoReply: {
        ...settings.globalNoReply,
        prompt: settings.globalNoReply.prompt && Prompt.simple.toDB(settings.globalNoReply.prompt),
      },
    }),
  })
);

export const simple = createSimpleAdapter<
  Omit<BaseVersion.Settings, 'session'>,
  Models.Version.Settings.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (settings, options) => smart.fromDB(BaseVersion.defaultSettings(settings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = {
  smart,
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
