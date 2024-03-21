import { SystemVariable } from './system-variable.enum';
import { VariableDatatype } from './variable-datatype.enum';

export const VARIABLE_NAME_MAX_LENGTH = 64;

export const SYSTEM_VARIABLE_TYPE_MAP = {
  [SystemVariable.LOCALE]: VariableDatatype.TEXT,
  [SystemVariable.CHANNEL]: VariableDatatype.TEXT,
  [SystemVariable.USER_ID]: VariableDatatype.TEXT,
  [SystemVariable.PLATFORM]: VariableDatatype.TEXT,
  [SystemVariable.SESSIONS]: VariableDatatype.NUMBER,
  [SystemVariable.TIMESTAMP]: VariableDatatype.TEXT,
  [SystemVariable.VF_MEMORY]: VariableDatatype.TEXT,
  [SystemVariable.LAST_EVENT]: VariableDatatype.ANY,
  [SystemVariable.LAST_RESPONSE]: VariableDatatype.TEXT,
  [SystemVariable.LAST_UTTERANCE]: VariableDatatype.TEXT,
  [SystemVariable.INTENT_CONFIDENCE]: VariableDatatype.NUMBER,
  [SystemVariable.VF_CHUNKS]: VariableDatatype.ANY,
} satisfies Record<SystemVariable, VariableDatatype>;

export const SYSTEM_VARIABLE_DESCRIPTION_MAP = {
  [SystemVariable.LOCALE]: 'The locale of the user (eg. en-US, en-CA, it-IT, fr-FR, ...).',
  [SystemVariable.CHANNEL]: null,
  [SystemVariable.USER_ID]: "The user's unique ID.",
  [SystemVariable.PLATFORM]: 'The platform your agent is running on (e.g. "voiceflow").',
  [SystemVariable.SESSIONS]: 'The number of times a particular user has opened the app.',
  [SystemVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC).',
  [SystemVariable.VF_MEMORY]:
    'Last 10 user inputs and agent responses in a string (e.g. "agent: How can i help?"\nuser: What\'s the weather today?).',
  [SystemVariable.LAST_EVENT]: 'The object containing the last event that the user client has triggered.',
  [SystemVariable.LAST_RESPONSE]: "The agent's last response (text/speak) in a string.",
  [SystemVariable.LAST_UTTERANCE]: "The user's last utterance in a text string.",
  [SystemVariable.INTENT_CONFIDENCE]:
    'The confidence interval (measured as a value from 0 to 100) for the most recently matched intent.',
  [SystemVariable.VF_CHUNKS]:
    'Dynamically stores the last chunks retrieved from the Knowledge Base whenever calling the KB from the canvas.',
} satisfies Record<SystemVariable, string | null>;
