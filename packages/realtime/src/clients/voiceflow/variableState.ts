import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface VariableStateClient {
  list: (projectID: string) => Promise<Realtime.DBVariableState[]>;
  create: (data: Realtime.DBVariableState) => Promise<Realtime.DBVariableState>;
}

const Client = ({ api }: ExtraOptions): VariableStateClient => ({
  list: (projectID) => api.get<Realtime.DBVariableState[]>(`/v2/projects/${projectID}/variable-states`).then((res) => res.data),
  create: (data) => api.post<Realtime.DBVariableState>(`/v2/variable-states`, data).then((res) => res.data),
});

export default Client;
