import { createDividerMenuItemOption } from '@voiceflow/ui';

import * as VariableState from '@/ducks/variableState';

export const baseOptions = [
  {
    label: 'All project variables',
    value: VariableState.ALL_PROJECT_VARIABLES_ID,
  },
];

export const dividerOption = createDividerMenuItemOption();
