import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';

import * as Models from '../models';

const PromptTypeSet = new Set<string>(Object.values(Models.Prompt.PromptType));

export type FactoryOptions = Base.Utils.Prompt.FactoryOptions;

export const textFactory = ({ defaultVoice }: Base.Utils.Prompt.FactoryOptions): Models.Prompt.Model => ({
  id: Utils.id.cuid.slug(),
  type: Models.Prompt.PromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});

export const audioFactory = (): Models.Prompt.Model => ({
  id: Utils.id.cuid.slug(),
  type: Models.Prompt.PromptType.AUDIO,
  content: '',
});

export const isPrompt = (value?: unknown): value is Models.Prompt.Model => {
  if (!Utils.object.isObject(value)) return false;
  if (!Utils.object.hasProperty(value, 'type')) return false;

  return typeof value.type === 'string' && PromptTypeSet.has(value.type);
};

export const CONFIG = Base.Utils.Prompt.extend({
  factory: textFactory,

  isPrompt,

  textFactory,

  audioFactory,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
