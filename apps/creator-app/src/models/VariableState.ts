export type VariableValue = string | boolean | number | null;

export interface Variable {
  name: string;
  value: VariableValue;
}

export interface VariableState {
  id: string;
  name: string;
  projectID: string;
  startFrom: { diagramID: string; stepID: string } | null;
  variables: Record<string, VariableValue>;
}
