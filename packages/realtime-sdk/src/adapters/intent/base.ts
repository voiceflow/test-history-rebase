import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import createAdapter from 'bidirectional-adapter';
import { Optional, Required } from 'utility-types';

import { BaseIntent, IntentInput } from '../../models';

export const intentInputSanitizer = ({ text, slots }: Partial<IntentInput> = {}): IntentInput => ({
  text: text || '',
  slots: slots || [],
});

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

export const baseIntentAdapter = createAdapter<BaseModels.Intent, Omit<BaseIntent, 'slots'>, [{ platform: Constants.PlatformType }]>(
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
