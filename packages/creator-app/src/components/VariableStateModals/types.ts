interface StartFrom {
  stepID: string;
  diagramID: string;
}
export interface VariableStateEditorValues {
  name: string;
  startFrom: StartFrom | null;
  variables: string[];
  variablesValues: Record<string, string>;
}
