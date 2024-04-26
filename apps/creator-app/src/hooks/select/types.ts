import type { UIOnlyMenuItemOption } from '@voiceflow/ui';

export interface BaseSelectOption {
  id: string;
  label: string;
}

export interface BaseSelectGroup<Option> extends BaseSelectOption {
  options: Option[];
}

export interface BaseSelectMultilevel<Option> extends BaseSelectOption {
  options: Array<Option | BaseSelectMultilevel<Option> | UIOnlyMenuItemOption>;
}
