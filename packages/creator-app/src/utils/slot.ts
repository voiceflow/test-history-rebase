import { Utils } from '@voiceflow/realtime-sdk';

export const {
  getSlotTypes,
  transformVariablesFromReadable,
  transformVariablesToReadable,
  transformVariablesFromReadableWithoutTrim,
  transformVariableToString,
  isVariable,
  slotToString,
  validateSlotName,
} = Utils.slot;
