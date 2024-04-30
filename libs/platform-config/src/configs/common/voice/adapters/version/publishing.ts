import type { BaseVersion } from '@voiceflow/base-types';
import type { SimpleAdapter, SmartSimpleAdapter } from 'bidirectional-adapter';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import type * as Models from '../../models';

export type FromAndToDBOptions = Base.Adapters.Version.Publishing.FromAndToDBOptions;

export const smart = Base.Adapters.Version.Publishing.smart as SmartSimpleAdapter<
  BaseVersion.Publishing,
  Pick<Models.Version.Publishing.Model, keyof BaseVersion.Publishing>,
  FromAndToDBOptions,
  FromAndToDBOptions
>;

export const simple = Base.Adapters.Version.Publishing.simple as SimpleAdapter<
  BaseVersion.Publishing,
  Models.Version.Publishing.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>;

export const CONFIG = Base.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Base.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
