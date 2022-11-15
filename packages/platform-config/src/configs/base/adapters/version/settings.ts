import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export type FromAndToDBOptions = [{ defaultVoice: string }];

const SHARED_FIELDS = Types.satisfies<keyof BaseVersion.Settings>()([
  'error',
  'repeat',
  'globalNoReply',
  'globalNoMatch',
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
  (dbSettings) => ConfigUtils.pickNonEmptyFields(dbSettings, SHARED_FIELDS),
  (settings) => ConfigUtils.pickNonEmptyFields(settings, SHARED_FIELDS)
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
