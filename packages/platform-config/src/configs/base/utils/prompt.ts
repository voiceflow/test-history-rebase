import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { Utils } from '@voiceflow/common';

import * as Models from '../models';

export interface FactoryOptions {
  defaultVoice?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const factory = (_options: FactoryOptions): Models.Prompt.Model => ({ id: Utils.id.cuid.slug() });

export interface Config {
  factory: typeof factory;
}

export const CONFIG = Types.satisfies<Config>()({ factory });

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
