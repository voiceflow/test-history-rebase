import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';

import * as Models from '../models';

const PromptTypeSet = new Set<string>(Object.values(Models.Prompt.PromptType));

export const textFactory = ({ content = '', defaultVoice }: Base.Utils.Prompt.FactoryOptions = {}): Models.Prompt.Model => ({
  id: Utils.id.cuid.slug(),
  type: Models.Prompt.PromptType.TEXT,
  voice: defaultVoice ?? '',
  content,
});

export const audioFactory = ({ content = '' }: Base.Utils.Prompt.FactoryOptions = {}): Models.Prompt.Model => ({
  id: Utils.id.cuid.slug(),
  type: Models.Prompt.PromptType.AUDIO,
  content,
});

export const isPrompt = (value?: unknown): value is Models.Prompt.Model => {
  if (!Utils.object.isObject(value)) return false;
  if (!Utils.object.hasProperty(value, 'type')) return false;

  return typeof value.type === 'string' && PromptTypeSet.has(value.type);
};

export const isEmpty = (prompt?: Models.Prompt.Model): boolean => {
  if (!prompt) return true;

  if (prompt.type === Models.Prompt.PromptType.TEXT) return !prompt.content?.trim?.();
  if (prompt.type === Models.Prompt.PromptType.AUDIO) return !prompt.audio?.trim?.();

  return true;
};

export const CONFIG = Base.Utils.Prompt.extend({
  factory: textFactory,

  isEmpty,

  isPrompt,

  textFactory,

  audioFactory,
})(Base.Utils.Prompt.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
