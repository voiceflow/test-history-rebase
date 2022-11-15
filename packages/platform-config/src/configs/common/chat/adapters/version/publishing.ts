import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export const smart = createSmartSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model>(
  (dbPublishing) => Base.Adapters.Version.Publishing.smart.fromDB(dbPublishing, { defaultVoice: '' }),
  (publishing) => Base.Adapters.Version.Publishing.smart.toDB(publishing, { defaultVoice: '' })
);

export const simple = createSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model>(smart.fromDB, smart.toDB);

export const CONFIG = Base.Adapters.Version.Publishing.extend({
  smart,
  simple,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
