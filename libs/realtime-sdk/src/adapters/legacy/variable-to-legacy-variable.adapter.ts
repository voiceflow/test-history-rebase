import type { Variable } from '@voiceflow/dtos';
import { SYSTEM_VARIABLE_DESCRIPTION_MAP, SYSTEM_VARIABLE_TYPE_MAP, VariableDatatype } from '@voiceflow/dtos';
import { isSystemVariableName } from '@voiceflow/utils-designer';
import { createSimpleAdapter } from 'bidirectional-adapter';

interface ToDBOptions {
  creatorID: number;
  assistantID: string;
  environmentID: string;
}

const adapter = createSimpleAdapter<Variable, string, [], [ToDBOptions]>(
  (variable) => variable.name,
  (variableName, { creatorID, assistantID, environmentID }) => {
    const isSystem = isSystemVariableName(variableName);

    return {
      id: variableName,
      name: variableName,
      color: '#515A63',
      isArray: false,
      isSystem,
      folderID: null,
      datatype: isSystem ? SYSTEM_VARIABLE_TYPE_MAP[variableName] : VariableDatatype.ANY,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      createdByID: creatorID,
      assistantID,
      updatedByID: creatorID,
      description: isSystem ? SYSTEM_VARIABLE_DESCRIPTION_MAP[variableName] : null,
      defaultValue: null,
      environmentID,
    };
  }
);

export const variableToLegacyVariableAdapter = Object.assign(adapter, {
  mapFromDB: (variables: Variable[]): string[] => variables.map(adapter.fromDB),

  mapToDB: (variableNames: string[], options: ToDBOptions): Variable[] =>
    variableNames.map((variableName) => adapter.toDB(variableName, options)),
});
