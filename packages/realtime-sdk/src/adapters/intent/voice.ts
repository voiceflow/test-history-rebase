import { VoiceIntent, VoiceIntentSlot, VoiceIntentSlotDialog } from '@realtime-sdk/models';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import { baseIntentAdapter, baseIntentSlotDialogSanitizer, baseIntentSlotSanitizer } from './base';

export const voiceIntentPromptSanitizer = ({
  text,
  slots,
  voice,
}: Optional<VoiceModels.IntentPrompt<string>> = {}): VoiceModels.IntentPrompt<string> => ({
  text: text || '',
  slots: slots || [],
  voice,
});

export const voiceIntentSlotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<VoiceIntentSlotDialog> = {}): VoiceIntentSlotDialog => ({
  ...baseIntentSlotDialogSanitizer(baseDialog),
  prompt: prompt.map(voiceIntentPromptSanitizer),
  confirm: confirm.map(voiceIntentPromptSanitizer),
});

export const voiceIntentSlotSanitizer = ({ dialog, ...baseIntentSlot }: Required<Optional<VoiceIntentSlot>, 'id'>): VoiceIntentSlot => ({
  ...baseIntentSlotSanitizer(baseIntentSlot),
  dialog: voiceIntentSlotDialogSanitizer(dialog),
});

const voiceIntentAdapter = createAdapter<VoiceModels.Intent<string>, VoiceIntent, [{ platform: VoiceflowConstants.PlatformType }]>(
  ({ slots = [], ...baseIntent }, options) => ({
    ...baseIntentAdapter.fromDB(baseIntent, options),
    slots: normalize(slots.map(voiceIntentSlotSanitizer)),
  }),
  ({ slots, ...baseIntent }) => ({
    ...baseIntentAdapter.toDB(baseIntent),
    slots: denormalize(slots).map(voiceIntentSlotSanitizer),
  })
);

export default voiceIntentAdapter;
