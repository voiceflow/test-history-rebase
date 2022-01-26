import { Nullish } from '@voiceflow/common';
import { GetOptionLabel, SelectProps } from '@voiceflow/ui';

import { RequiredProps } from '@/types';

type NotAvailable = 'onSelect' | 'creatable' | 'onCreate' | 'getOptionLabel';
type MakeItRequired = 'getOptionValue';

export type TagSelectProps<O, V> = Omit<SelectProps<O, V>, NotAvailable | 'value'> & {
  onChange: (value: string[]) => void;
  getOptionLabel: GetOptionLabel<O>;
  value: Nullish<string>[];
} & RequiredProps<SelectProps<O, V>, MakeItRequired>;
