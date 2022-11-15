import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';

import * as Models from '../models';
import * as Utils from '../utils';
import { hasValue } from './utils';

export type KeyRemap = [['key', 'id']];

export const smart = createSmartMultiAdapter<BaseModels.Intent, Models.Intent.Model, [], [], KeyRemap>(
  (dbIntent) => ({
    ...(hasValue(dbIntent, 'key') && { id: dbIntent.key }),
    ...(hasValue(dbIntent, 'name') && { name: dbIntent.name }),
    ...(hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots) }),
    ...(hasValue(dbIntent, 'noteID') && { noteID: dbIntent.noteID }),
    ...(hasValue(dbIntent, 'inputs') && { inputs: dbIntent.inputs.map(Utils.Intent.inputSanitizer) }),
  }),
  (intent) => ({
    ...(hasValue(intent, 'id') && { key: intent.id }),
    ...(hasValue(intent, 'name') && { name: intent.name }),
    ...(hasValue(intent, 'slots') && { slots: denormalize(intent.slots) }),
    ...(hasValue(intent, 'noteID') && { noteID: intent.noteID }),
    ...(hasValue(intent, 'inputs') && { inputs: intent.inputs.map(Utils.Intent.inputSanitizer) }),
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
