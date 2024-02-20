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

const variableNameToDescription = (variableName: string): string | null => {
  switch (variableName) {
    case SystemVariable.LOCALE:
      return 'The locale of the user (eg. en-US, en-CA, it-IT, fr-FR, ...).';
    case SystemVariable.USER_ID:
      return "The user's unique ID.";
    case SystemVariable.PLATFORM:
      return 'The platform your assistant is running on (voiceflow, alexa, ...).';
    case SystemVariable.LAST_RESPONSE:
      return "The assistant's last response (text/speak) in a string.";
    case SystemVariable.LAST_UTTERANCE:
      return "The user's last utterance in a text string.";
    case SystemVariable.SESSIONS:
      return 'The number of times a particular user has opened the app.';
    case SystemVariable.TIMESTAMP:
      return 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC).';
    case SystemVariable.INTENT_CONFIDENCE:
      return 'The confidence interval (measured as a value from 0 to 100) for the most recently matched intent.';
    default:
      return null;
  }
};

const adapter = createSimpleAdapter<Variable, string, [], [ToDBOptions]>(
  (variable) => variable.name,
  (variableName, { creatorID, assistantID, environmentID }) => ({
    id: variableName,
    name: variableName,
    color: '#515A63',
    isArray: false,
    isSystem: isSystemVariableName(variableName),
    folderID: null,
    datatype: variableNameToDatatype(variableName),
    createdAt: new Date().toJSON(),
    updatedAt: new Date().toJSON(),
    createdByID: creatorID,
    assistantID,
    updatedByID: creatorID,
    description: variableNameToDescription(variableName),
    defaultValue: null,
    environmentID,
  })
);

export const variableToLegacyVariableAdapter = Object.assign(adapter, {
  mapFromDB: (variables: Variable[]): string[] => variables.map(adapter.fromDB),

  mapToDB: (variableNames: string[], options: ToDBOptions): Variable[] => variableNames.map((variableName) => adapter.toDB(variableName, options)),
});
