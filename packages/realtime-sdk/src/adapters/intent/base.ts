import { BaseIntent, IntentInput } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { Optional, Required } from 'utility-types';

import { hasValue } from '../utils';

export const intentInputSanitizer = ({ text, slots }: Partial<IntentInput> = {}): IntentInput => ({ text: text || '', slots: slots || [] });

export const baseIntentSlotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  utterances = [],
  confirmEnabled = false,
}: Partial<BaseModels.IntentSlotDialog> = {}): BaseModels.IntentSlotDialog => ({
  prompt,
  confirm,
  utterances: utterances.map(intentInputSanitizer),
  confirmEnabled,
});

export const baseIntentSlotSanitizer = ({
  id,
  dialog,
  required = false,
}: Required<Optional<BaseModels.IntentSlot>, 'id'>): BaseModels.IntentSlot => ({
  id,
  dialog: baseIntentSlotDialogSanitizer(dialog),
  required,
});

export type BaseIntentAdapterKeyRemap = [['key', 'id']];

export const baseIntentSmartAdapter = createSmartMultiAdapter<
  Omit<BaseModels.Intent, 'slots'>,
  Omit<BaseIntent, 'slots'>,
  [],
  [],
  BaseIntentAdapterKeyRemap
>(
  (dbIntent) => ({
    ...(hasValue(dbIntent, 'key') && { id: dbIntent.key }),
    ...(hasValue(dbIntent, 'name') && { name: dbIntent.name }),
    ...(hasValue(dbIntent, 'noteID') && { noteID: dbIntent.noteID }),
    ...(hasValue(dbIntent, 'inputs') && { inputs: dbIntent.inputs.map(intentInputSanitizer) }),
  }),
  (intent) => ({
    ...(hasValue(intent, 'id') && { key: intent.id }),
    ...(hasValue(intent, 'name') && { name: intent.name }),
    ...(hasValue(intent, 'noteID') && { noteID: intent.noteID }),
    ...(hasValue(intent, 'inputs') && { inputs: intent.inputs.map(intentInputSanitizer) }),
  })
);

export const baseIntentAdapter = createMultiAdapter<Omit<BaseModels.Intent, 'slots'>, Omit<BaseIntent, 'slots'>>(
  ({ inputs = [], ...baseIntent }) => baseIntentSmartAdapter.fromDB({ inputs, ...baseIntent }),
  baseIntentSmartAdapter.toDB
);
