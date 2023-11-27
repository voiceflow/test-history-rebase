import { type AnyRecord } from '@voiceflow/common';
import { toast, usePersistFunction } from '@voiceflow/ui-next';
import type { Options as ToastOptions } from '@voiceflow/ui-next/build/esm/contexts/ToastContext/Toast.context';
import { IValidator, IValidatorErrorResult, IValidatorSuccessResult, IValidatorWithContext } from '@voiceflow/utils-designer';
import { useEffect } from 'react';
import { UnionToIntersection } from 'utility-types';

type ValidatorErrorSetterTuple = [validator: IValidator<any> | IValidatorWithContext<any, any>, setError: (error: null | string) => void];

type ValidatorsData<InputStates extends { [key: string]: ValidatorErrorSetterTuple }> = {
  [Key in keyof InputStates]: Required<InputStates[Key][0]>['_input'];
};

type ValidatorsContext<InputStates extends { [key: string]: ValidatorErrorSetterTuple }> = Required<
  InputStates[keyof InputStates][0]
>['_context'] extends void
  ? void
  : UnionToIntersection<Required<InputStates[keyof InputStates][0]>['_context']>;

type ValidateResult<InputStates extends { [key: string]: ValidatorErrorSetterTuple }> =
  | IValidatorSuccessResult<ValidatorsData<InputStates>>
  | { errors: { [Key in keyof InputStates]?: IValidatorErrorResult }; success: false };

interface ValidatorsAPI<InputStates extends { [key: string]: ValidatorErrorSetterTuple }> {
  validate: ValidatorsContext<InputStates> extends void
    ? (data: ValidatorsData<InputStates>) => ValidateResult<InputStates>
    : (data: ValidatorsData<InputStates>, context?: ValidatorsContext<InputStates>) => ValidateResult<InputStates>;

  container: ValidatorsContext<InputStates> extends void
    ? (callback: (fields: ValidatorsData<InputStates>) => void) => (fields: ValidatorsData<InputStates>) => void
    : (
        callback: (fields: ValidatorsData<InputStates>) => void,
        getContext: () => ValidatorsContext<InputStates>
      ) => (fields: ValidatorsData<InputStates>) => void;
}

interface IUseValidators {
  <InputStates extends { [key: string]: ValidatorErrorSetterTuple }>(fields: InputStates): ValidatorsAPI<InputStates>;
}

export const useValidators: IUseValidators = (validatorsMap) => {
  const validate = (fields: AnyRecord = {}, context?: unknown) => {
    const errors: { [key: string]: IValidatorErrorResult } = {};
    const data: AnyRecord = {};
    let success = true;

    Object.entries(fields).forEach(([key, value]) => {
      const [validator, setError] = validatorsMap[key];

      const result = validator(value, context);

      if (!result.success) {
        success = false;
        errors[key] = result;
        setError(result.error.message);
      } else {
        data[key] = result.data;
        setError(null);
      }
    });

    return success ? { success, data } : { success, errors };
  };

  const container = (callback: (fields: AnyRecord) => unknown, getContext?: () => unknown) => (fields: AnyRecord) => {
    const validator = validate(fields, getContext?.());

    if (!validator.success) return;

    callback(validator.data);
  };

  return { validate, container } as any;
};

export const useValidateWarningOnUnmount = ({
  prefix,
  options,
  validator,
}: {
  prefix?: string | null;
  options?: ToastOptions;
  validator: null | (() => ValidateResult<{ [key: string]: ValidatorErrorSetterTuple }>);
}) => {
  const persistedValidator = usePersistFunction(validator);

  useEffect(
    () => () => {
      const result = persistedValidator();

      if (!result || result.success) return;

      const [message] = Object.values(result.errors)
        .map((error) => error?.error.message)
        .filter(Boolean);

      if (!message) return;

      toast.warning(`${prefix ?? ''} ${message}`, options);
    },
    []
  );
};
