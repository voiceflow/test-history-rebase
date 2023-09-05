import { type AnyRecord, type NullableRecord, type Nullish } from '@voiceflow/common';
import { usePersistFunction } from '@voiceflow/ui-next';

type UnknownRecord = Record<string, unknown>;

type SetFieldError<Fields extends UnknownRecord> = {
  [Key in keyof Fields as `set${Capitalize<Key & string>}Error`]?: (error: string | null) => void;
};

type ValidateField<Fields extends UnknownRecord> = {
  [Key in keyof Fields as `validate${Capitalize<Key & string>}`]: (value: Nullish<Fields[Key]>) => string | null | false | undefined;
};

interface FieldValidatorNegative {
  error: true;
  fields: never;
}

interface FieldValidatorPositive<Fields extends UnknownRecord> {
  error: false;
  fields: Fields;
}

interface Validator<Fields extends UnknownRecord> {
  validate: (fields: Partial<NullableRecord<Fields>>) => FieldValidatorNegative | FieldValidatorPositive<Fields>;

  container: (callback: (fields: Fields) => void) => (fields: Partial<NullableRecord<Fields>>) => void;
}

interface IValidator {
  <Fields extends UnknownRecord>(operations: ValidateField<Fields> & SetFieldError<Fields>): Validator<Fields>;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const useValidator: IValidator = (operations) => {
  const validate = usePersistFunction((fields: AnyRecord) => {
    let error = false;

    Object.entries(fields).forEach(([key, value]) => {
      const capitalizedKey = capitalize(key);

      const fieldError = operations[`validate${capitalizedKey}` as any]?.(value);

      error ||= !!fieldError;
      operations[`set${capitalizedKey}Error` as any]?.(fieldError || null);
    });

    return { error, fields };
  });

  const container = usePersistFunction((callback: (fields: AnyRecord) => unknown) => (fields: AnyRecord) => {
    const validator = validate(fields);

    if (validator.error) return;

    callback(validator.fields);
  });

  return { validate, container } as any;
};
