import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

export interface ValidateOptions {
  value?: string;
  locales?: string[];
}

/**
 * returns error if value is not a valid
 */
export const validate = (options: ValidateOptions): string | null => (!options.value?.trim() ? 'Invocation name is required' : null);

export interface Config {
  validate: typeof validate;
}

export const CONFIG = Types.satisfies<Config>()({
  validate,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
