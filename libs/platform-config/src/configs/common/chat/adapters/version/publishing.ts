import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export type FromAndToDBOptions = Base.Adapters.Version.Publishing.FromAndToDBOptions;

export const smart = createSmartSimpleAdapter<
  BaseVersion.Publishing,
  Pick<Models.Version.Publishing.Model, keyof BaseVersion.Publishing>,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbPublishing, options) => Base.Adapters.Version.Publishing.smart.fromDB(dbPublishing, options),
  (publishing, options) => Base.Adapters.Version.Publishing.smart.toDB(publishing, options)
);

export const simple = createSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model, FromAndToDBOptions, FromAndToDBOptions>(
  (dbPublishing, options) => Base.Adapters.Version.Publishing.simple.fromDB(dbPublishing, options),
  (publishing, options) => Base.Adapters.Version.Publishing.simple.toDB(publishing, options)
);

export const CONFIG = Base.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Base.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
