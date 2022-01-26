export interface DBVariableState {
  _id: string;
  projectID: string;
  name: string;
  startFrom: { diagramID: string; stepID: string } | null;
  variables: Record<string, string | number | boolean | null>;
}

export type VariableStateData = Omit<DBVariableState, '_id'>;

export type VariableState = Omit<DBVariableState, '_id'> & { id: string };
