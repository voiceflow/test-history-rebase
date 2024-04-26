import type { UIOnlyMenuItemOption } from '@voiceflow/ui';

import type { BaseSelectGroup, BaseSelectMultilevel, BaseSelectOption } from './types';

export const createGroupedSelectID = (...ids: string[]) => ids.join('::');

export const isNonEmptyGroupedOptionFactory =
  <Option extends BaseSelectOption>() =>
  <T extends BaseSelectGroup<Option> | BaseSelectMultilevel<Option> | Option | UIOnlyMenuItemOption>(
    option?: T | null
  ): option is T extends BaseSelectGroup<Option> | BaseSelectMultilevel<Option> ? T : never =>
    !!option && 'options' in option && option.options.length > 0;
