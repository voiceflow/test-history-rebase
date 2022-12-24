import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { Utils } from '@voiceflow/common';

import * as Models from '../models';

export interface FactoryOptions {
  content?: string;
  defaultVoice?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const factory = (_options?: FactoryOptions): Models.Prompt.Model => ({ id: Utils.id.cuid.slug() });

export const isEmpty = () => true;

export const isPrompt = (_value?: unknown): _value is Models.Prompt.Model => false;

export interface Config {
  factory: typeof factory;

  isEmpty: (prompt?: Models.Prompt.Model) => boolean;

  isPrompt: (value?: unknown) => value is Models.Prompt.Model;
}

export const CONFIG = Types.satisfies<Config>()({
  factory,

  isEmpty,

  isPrompt,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
