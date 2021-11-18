import { VoiceIntent, VoiceIntentSlot, VoiceIntentSlotDialog } from '@realtime-sdk/models';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { Types } from '@voiceflow/voice-types';
import createAdapter from 'bidirectional-adapter';
import { Optional, Required } from 'utility-types';

import { baseIntentAdapter, baseIntentSlotDialogSanitizer, baseIntentSlotSanitizer } from './base';

export const voiceIntentPromptSanitizer = ({ text, slots, voice }: Optional<Types.IntentPrompt<string>> = {}): Types.IntentPrompt<string> => ({
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

const voiceIntentAdapter = createAdapter<Types.Intent<string>, VoiceIntent, [{ platform: Constants.PlatformType }]>(
  ({ slots = [], ...baseIntent }, options) => ({
    ...baseIntentAdapter.fromDB(baseIntent, options),
    slots: Utils.normalized.normalize(slots.map(voiceIntentSlotSanitizer)),
  }),
  ({ slots, ...baseIntent }) => ({
    ...baseIntentAdapter.toDB(baseIntent),
    slots: Utils.normalized.denormalize(slots).map(voiceIntentSlotSanitizer),
  })
);

export default voiceIntentAdapter;
