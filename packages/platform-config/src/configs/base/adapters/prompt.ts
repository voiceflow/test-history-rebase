import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { createMultiAdapter } from 'bidirectional-adapter';

export const simple = createMultiAdapter<unknown, unknown>(
  (prompt) => prompt,
  (prompt) => prompt
);

export const CONFIG = {
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
