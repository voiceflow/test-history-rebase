import * as Realtime from '@voiceflow/realtime-sdk';

export const {
  isVariable,
  slotToString,
  getSlotTypes,
  transformVariableToString,
  transformVariablesToReadable,
  transformVariablesFromReadable,
  transformVariablesFromReadableWithoutTrim,
} = Realtime.Utils.slot;

export const isDefaultSlotName = (name?: string | null) => !name || name.toLowerCase().startsWith('entity');
