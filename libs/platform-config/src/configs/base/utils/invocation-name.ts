import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

export interface ValidateOptions {
  value?: string | null;
  locales?: string[];
}

/**
 * returns error if value is not a valid
 */
export const validateName = (options: ValidateOptions): string | null =>
  !options.value?.trim() ? 'Invocation name is required' : null;

export interface Config {
  validate: typeof validateName;
}

export const CONFIG = Types.satisfies<Config>()({
  validate: validateName,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
