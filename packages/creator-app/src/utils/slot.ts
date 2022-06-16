import * as Realtime from '@voiceflow/realtime-sdk';

export const {
  getSlotTypes,
  transformVariablesFromReadable,
  transformVariablesToReadable,
  transformVariablesFromReadableWithoutTrim,
  transformVariableToString,
  isVariable,
  slotToString,
  validateSlotName,
  CUSTOM_ENTITY_VALUE_ERROR_MSG,
} = Realtime.Utils.slot;
