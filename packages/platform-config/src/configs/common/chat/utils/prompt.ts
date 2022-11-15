import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';

import * as Models from '../models';

export const factory = (): Models.Prompt.Model => ({ id: Utils.id.cuid(), content: [{ children: [{ text: '' }] }] });

export const isPrompt = (value?: unknown): value is Models.Prompt.Model => {
  if (!Utils.object.isObject(value)) return false;

  return Utils.object.hasProperty(value, 'content') && Array.isArray(value.content);
};

export const CONFIG = Base.Utils.Prompt.extend({
  factory,

  isPrompt,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
