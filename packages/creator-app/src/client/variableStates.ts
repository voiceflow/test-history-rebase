import * as Realtime from '@voiceflow/realtime-sdk';

import variableStateAdapter from './adapters/variableState';
import { apiV2 } from './fetch';

export const VARIABLE_STATES_PATH = 'variable-states';

const variableStateClient = {
  getByID: (variableStateID: string): Promise<Realtime.VariableState> =>
    apiV2.get<Realtime.DBVariableState>(`${VARIABLE_STATES_PATH}/${variableStateID}`).then(variableStateAdapter.fromDB),
};

export default variableStateClient;
