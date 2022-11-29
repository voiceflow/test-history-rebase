import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter, createSmartMultiAdapter, MultiAdapter, SmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';

import * as Models from '../models';
import * as Utils from '../utils';

export type KeyRemap = Base.Adapters.Intent.KeyRemap;

export const smart = createSmartMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model, [], [], KeyRemap>(
  ({ slots, ...dbIntent }) => ({
    ...Base.Adapters.Intent.smart.fromDB(dbIntent),
    ...(slots !== undefined && { slots: normalize(slots.map(Utils.Intent.slotSanitizer)) }),
  }),
  ({ slots, ...intent }) => ({
    ...Base.Adapters.Intent.smart.toDB(intent),
    ...(slots !== undefined && { slots: denormalize(slots).map(Utils.Intent.slotSanitizer) }),
  })
);

export const simple = createMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model>(
  ({ slots = [], ...dbIntent }) => smart.fromDB({ slots, ...dbIntent }),
  smart.toDB
);

export const CONFIG = Base.Adapters.Intent.extend({
  smart,
  simple,
})(Base.Adapters.Intent.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const smartFactory = <Voice extends string>() =>
  smart as unknown as SmartMultiAdapter<VoiceModels.Intent<Voice>, Models.Intent.Model<Voice>, [], [], KeyRemap>;

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() => simple as unknown as MultiAdapter<VoiceModels.Intent<Voice>, Models.Intent.Model<Voice>>;
