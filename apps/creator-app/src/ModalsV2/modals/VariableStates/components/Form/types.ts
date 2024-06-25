import type * as Realtime from '@voiceflow/realtime-sdk';

export interface Value extends Omit<Realtime.VariableState, 'id' | 'projectID'> {}

export interface StartFrom {
  stepID: string;
  diagramID: string;
}

export interface FormValues {
  name: string;
  startFrom: StartFrom | null;
  variables: string[];
  variablesValues: Record<string, string>;
}
