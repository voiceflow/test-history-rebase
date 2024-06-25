import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import type * as Models from '../models';

export const factory = ({ content = '' }: Base.Utils.Prompt.FactoryOptions = {}): Models.Prompt.Model => ({
  id: Utils.id.cuid(),
  content: [{ children: [{ text: content }] }],
});

export const isPrompt = (value?: unknown): value is Models.Prompt.Model => {
  if (!Utils.object.isObject(value)) return false;

  return Utils.object.hasProperty(value, 'content') && Array.isArray(value.content);
};

export const isEmpty = (prompt?: Models.Prompt.Model): boolean => {
  if (!prompt) return true;

  return !serializeToText(prompt.content).trim();
};

export const CONFIG = Base.Utils.Prompt.extend({
  factory,

  isEmpty,

  isPrompt,
})(Base.Utils.Prompt.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
