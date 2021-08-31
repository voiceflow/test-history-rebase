import { PlatformType } from '@voiceflow/internal';
import { Types } from '@voiceflow/voice-types';
import { Optional, Required } from 'utility-types';

import { VoiceIntent, VoiceIntentSlot, VoiceIntentSlotDialog } from '../../models';
import { denormalize, normalize } from '../../utils/normalized';
import { createAdapter } from '../utils';
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

const voiceIntentAdapter = createAdapter<Types.Intent<string>, VoiceIntent, [{ platform: PlatformType }]>(
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
