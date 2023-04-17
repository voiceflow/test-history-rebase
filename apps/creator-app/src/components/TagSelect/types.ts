import { Nullish } from '@voiceflow/common';
import { BaseSelectProps, GetOptionKey, GetOptionLabel, GetOptionValue, Primitive, UIOnlyMenuItemOption } from '@voiceflow/ui';

interface GenericProps<Option> {
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, string>;
}

interface BaseTagSelectProps<Option> extends BaseSelectProps {
  value: Nullish<string>[];
  options: Array<Option | UIOnlyMenuItemOption>;
  onChange: (value: string[]) => void;
  maxHeight?: number;
  selectAllLabel?: string;
}

export interface PrimitiveTagSelectProps<Option extends Primitive> extends BaseTagSelectProps<Option>, Partial<GenericProps<Option>> {
  getOptionLabel?: GetOptionLabel<Option>;
}

export interface TagSelectProps<Option> extends BaseTagSelectProps<Option>, GenericProps<Option> {
  getOptionLabel: GetOptionLabel<string>;
}

export interface TagSelectInternalProps extends BaseTagSelectProps<unknown>, Partial<GenericProps<unknown>> {
  getOptionLabel?: GetOptionLabel<any>;
}
