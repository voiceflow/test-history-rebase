import { Intent as DBIntent, IntentSlot, IntentSlotDialog } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';
import { Optional, Required } from 'utility-types';

import { BaseIntent, IntentInput } from '../../models';
import { createAdapter } from '../utils';

export const intentInputSanitizer = ({ text, slots }: Partial<IntentInput> = {}): IntentInput => ({
  text: text || '',
  slots: slots || [],
});

export const baseIntentSlotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  utterances = [],
  confirmEnabled = false,
}: Partial<IntentSlotDialog> = {}): IntentSlotDialog => ({
  prompt,
  confirm,
  utterances: utterances.map(intentInputSanitizer),
  confirmEnabled,
});

export const baseIntentSlotSanitizer = ({ id, dialog, required = false }: Required<Optional<IntentSlot>, 'id'>): IntentSlot => ({
  id,
  dialog: baseIntentSlotDialogSanitizer(dialog),
  required,
});

export const baseIntentAdapter = createAdapter<DBIntent, Omit<BaseIntent, 'slots'>, [{ platform: PlatformType }]>(
  ({ key, name, inputs = [] }, { platform }) => ({
    id: key,
    name,
    inputs: inputs.map(intentInputSanitizer),
    platform,
  }),
  ({ id, name, inputs }) => ({
    key: id,
    name,
    inputs: inputs.map(intentInputSanitizer),
  })
);
