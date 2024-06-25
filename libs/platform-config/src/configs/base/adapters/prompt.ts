import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

import type * as Models from '../models';

export const simple = createMultiAdapter<unknown, Models.Prompt.Model>(
  (prompt) =>
    !prompt
      ? { id: Utils.id.cuid.slug() }
      : {
          ...prompt,
          id:
            Utils.object.hasProperty(prompt, 'id') && typeof prompt.id === 'string' ? prompt.id : Utils.id.cuid.slug(),
        },
  (prompt) => prompt
);

export const CONFIG = {
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
