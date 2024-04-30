import type { ChatModels } from '@voiceflow/chat-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import type * as Models from '../models';
import * as Utils from '../utils';

export const smart = createSmartMultiAdapter<
  ChatModels.Intent,
  Models.Intent.Model,
  [],
  [],
  Base.Adapters.Intent.KeyRemap
>(
  ({ slots, ...dbIntent }) => ({
    ...Base.Adapters.Intent.smart.fromDB(dbIntent),
    ...(slots !== undefined && { slots: normalize(slots.map(Utils.Intent.slotSanitizer)) }),
  }),
  ({ slots, ...intent }) => ({
    ...Base.Adapters.Intent.smart.toDB(intent),
    ...(slots !== undefined && { slots: denormalize(slots).map(Utils.Intent.slotSanitizer) }),
  })
);

export const simple = createMultiAdapter<ChatModels.Intent, Models.Intent.Model>(
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
