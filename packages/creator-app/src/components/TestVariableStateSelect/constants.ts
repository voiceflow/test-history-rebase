import { createUIOnlyMenuItemOption } from '@voiceflow/ui';

import * as variableState from '@/ducks/variableState';

export const baseOptions = [
  {
    label: 'All project variables',
    value: variableState.ALL_PROJECT_VARIABLES_ID,
  },
];

export const dividerOption = createUIOnlyMenuItemOption('divider', { divider: true });
