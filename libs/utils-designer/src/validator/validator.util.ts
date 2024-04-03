import type { z } from 'zod';

import type { IComposeValidators, IValidator, IValidatorFactory, IValidatorResult } from './validator.interface';

export const validatorZodFactory =
  <T extends z.ZodTypeAny>(scheme: T): IValidator<z.input<T>> =>
  (value) => {
    const result = scheme.safeParse(value);

    if (result.success) return result;

    return { success: false, error: new Error(result.error.issues[0].message) };
  };

export const validatorFactory: IValidatorFactory =
  (
    refinement: (value: unknown, context?: unknown) => unknown,
    message: string | ((value: unknown, context?: unknown) => string)
  ) =>
  (value: unknown, context?: unknown): IValidatorResult<unknown> => {
    if (refinement(value, context)) {
      return { success: true, data: value };
    }

    return { success: false, error: new Error(typeof message === 'function' ? message(value, context) : message) };
  };

export const composeValidators: IComposeValidators =
  (...validators: Array<(value: any, context?: unknown) => IValidatorResult<unknown>>) =>
  (value: unknown, context?: unknown): IValidatorResult<unknown> => {
    if (validators.length === 1) return validators[0](value, context);

    let result: IValidatorResult<unknown> = { success: true, data: value };

    for (const validator of validators) {
      result = validator(result.data, context);

      if (!result.success) {
        return result;
      }
    }

    return result;
  };
