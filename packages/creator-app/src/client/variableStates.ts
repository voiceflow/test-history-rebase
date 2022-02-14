import { VariableState } from '@/models';

import { api } from './fetch';

export const VARIABLE_STATES_PATH = 'variable-states';

const variableStateClient = {
  getByID: (variableStateID: string): Promise<VariableState> => api.get<VariableState>(`${VARIABLE_STATES_PATH}/${variableStateID}`),
};

export default variableStateClient;
