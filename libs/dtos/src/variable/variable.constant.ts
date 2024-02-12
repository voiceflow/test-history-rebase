import { SystemVariable } from './system-variable.enum';
import { VariableDatatype } from './variable-datatype.enum';

export const VARIABLE_NAME_MAX_LENGTH = 64;

export const SYSTEM_VARIABLE_TYPE_MAP = {
  [SystemVariable.CHANNEL]: VariableDatatype.TEXT,
  [SystemVariable.INTENT_CONFIDENCE]: VariableDatatype.NUMBER,
  [SystemVariable.LAST_EVENT]: VariableDatatype.ANY,
  [SystemVariable.LAST_RESPONSE]: VariableDatatype.TEXT,
  [SystemVariable.LAST_UTTERANCE]: VariableDatatype.TEXT,
  [SystemVariable.LOCALE]: VariableDatatype.TEXT,
  [SystemVariable.PLATFORM]: VariableDatatype.TEXT,
  [SystemVariable.SESSIONS]: VariableDatatype.NUMBER,
  [SystemVariable.TIMESTAMP]: VariableDatatype.TEXT,
  [SystemVariable.USER_ID]: VariableDatatype.TEXT,
} satisfies Record<SystemVariable, VariableDatatype>;
