import type { Nullish } from '@voiceflow/common';

export interface Validator<T> {
  (value: Nullish<T>): string | undefined | false;
}

export const uniqNameValidatorFactory =
  <Item extends { name: string }>({ items: itemsProps, label }: { items: Item[] | (() => Item[]); label: string }): Validator<string> =>
  (value?: string | null) => {
    const items = typeof itemsProps === 'function' ? itemsProps() : itemsProps;
    const transformedValue = value?.trim().toLowerCase();

    const nameExists = items.some((item) => item.name.trim().toLowerCase() === transformedValue);

    return nameExists && `${label} name already exists.`;
  };

export const requiredNameValidator: Validator<string> = (value?: string | null) => !value?.trim() && 'Name is required';

export const composeValidators =
  <T>(...validators: Validator<T>[]) =>
  (value: Nullish<T>) =>
    validators.reduceRight<string | undefined | false>((error, validator) => error || validator(value), undefined);
