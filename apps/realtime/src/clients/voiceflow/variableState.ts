import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { ExtraOptions } from './types';

export interface VariableStateClient {
  list: (projectID: string) => Promise<Realtime.DBVariableState[]>;
  patch: (variableStateID: string, data: Partial<Realtime.DBVariableState>) => Promise<Realtime.DBVariableState>;
  delete: (variableStateID: string) => Promise<void>;
  create: (data: Realtime.VariableStateData) => Promise<Realtime.DBVariableState>;
}

const Client = ({ api }: ExtraOptions): VariableStateClient => ({
  list: (projectID) => api.get<Realtime.DBVariableState[]>(`/v2/projects/${projectID}/variable-states`).then((res) => res.data),
  create: (data) => api.post<Realtime.DBVariableState>('/variable-states', data).then((res) => res.data),
  patch: (variableStateID, data) => api.patch<Realtime.DBVariableState>(`/variable-states/${variableStateID}`, data).then((res) => res.data),
  delete: (variableStateID: string) => api.delete(`/variable-states/${variableStateID}`),
});

export default Client;
