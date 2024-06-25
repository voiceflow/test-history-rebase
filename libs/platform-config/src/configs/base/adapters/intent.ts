import { Config as ConfigUtils } from '@platform-config/configs/utils';
import type { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';

import type * as Models from '../models';
import * as Utils from '../utils';

export type KeyRemap = [['key', 'id']];

export const smart = createSmartMultiAdapter<BaseModels.Intent, Models.Intent.Model, [], [], KeyRemap>(
  (dbIntent) => ({
    slots: normalize(dbIntent.slots ?? []),
    ...(ConfigUtils.hasValue(dbIntent, 'key') && { id: dbIntent.key }),
    ...(ConfigUtils.hasValue(dbIntent, 'name') && { name: dbIntent.name }),
    ...(ConfigUtils.hasValue(dbIntent, 'noteID') && { noteID: dbIntent.noteID }),
    ...(ConfigUtils.hasValue(dbIntent, 'inputs') && { inputs: dbIntent.inputs.map(Utils.Intent.inputSanitizer) }),
  }),
  (intent) => ({
    ...(ConfigUtils.hasValue(intent, 'id') && { key: intent.id }),
    ...(ConfigUtils.hasValue(intent, 'name') && { name: intent.name }),
    ...(ConfigUtils.hasValue(intent, 'slots') && { slots: denormalize(intent.slots) }),
    ...(ConfigUtils.hasValue(intent, 'noteID') && { noteID: intent.noteID }),
    ...(ConfigUtils.hasValue(intent, 'inputs') && { inputs: intent.inputs.map(Utils.Intent.inputSanitizer) }),
  })
);

export const simple = createMultiAdapter<BaseModels.Intent, Models.Intent.Model>(
  ({ inputs = [], ...baseIntent }) => smart.fromDB({ inputs, ...baseIntent }),
  smart.toDB
);

export const CONFIG = {
  smart,
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
