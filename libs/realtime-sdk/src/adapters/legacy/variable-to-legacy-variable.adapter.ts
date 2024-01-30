import { SystemVariable, Variable, VariableDatatype } from '@voiceflow/dtos';
import { isSystemVariableName } from '@voiceflow/utils-designer';
import { createSimpleAdapter } from 'bidirectional-adapter';

interface ToDBOptions {
  creatorID: number;
  assistantID: string;
  environmentID: string;
}

const variableNameToDatatype = (variableName: string): VariableDatatype => {
  switch (variableName) {
    case SystemVariable.LOCALE:
    case SystemVariable.CHANNEL:
    case SystemVariable.USER_ID:
    case SystemVariable.PLATFORM:
    case SystemVariable.LAST_RESPONSE:
    case SystemVariable.LAST_UTTERANCE:
      return VariableDatatype.TEXT;
    case SystemVariable.SESSIONS:
    case SystemVariable.TIMESTAMP:
    case SystemVariable.INTENT_CONFIDENCE:
      return VariableDatatype.NUMBER;
    default:
      return VariableDatatype.ANY;
  }
};

const adapter = createSimpleAdapter<Variable, string, [], [ToDBOptions]>(
  (variable) => variable.name,
  (variableName, { creatorID, assistantID, environmentID }) => ({
    id: variableName,
    name: variableName,
    color: '',
    isArray: false,
    isSystem: isSystemVariableName(variableName),
    folderID: null,
    datatype: variableNameToDatatype(variableName),
    createdAt: new Date().toJSON(),
    updatedAt: new Date().toJSON(),
    createdByID: creatorID,
    assistantID,
    updatedByID: creatorID,
    description: null,
    defaultValue: null,
    environmentID,
  })
);

export const variableToLegacyVariableAdapter = Object.assign(adapter, {
  mapFromDB: (variables: Variable[]): string[] => variables.map(adapter.fromDB),

  mapToDB: (variableNames: string[], options: ToDBOptions): Variable[] => variableNames.map((variableName) => adapter.toDB(variableName, options)),
});
