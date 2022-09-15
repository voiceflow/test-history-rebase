import { VoiceIntent, VoiceIntentSlot, VoiceIntentSlotDialog } from '@realtime-sdk/models';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import { hasValue } from '../utils';
import {
  BaseIntentAdapterFromDBOptions,
  BaseIntentAdapterKeyRemap,
  BaseIntentAdapterToDBOptions,
  baseIntentSlotDialogSanitizer,
  baseIntentSlotSanitizer,
  baseIntentSmartAdapter,
} from './base';

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

export const voiceIntentSmartAdapter = createSmartMultiAdapter<
  VoiceModels.Intent<string>,
  VoiceIntent,
  BaseIntentAdapterFromDBOptions,
  BaseIntentAdapterToDBOptions,
  BaseIntentAdapterKeyRemap
>(
  (dbIntent, options) => ({
    ...baseIntentSmartAdapter.fromDB(dbIntent, options),
    ...(hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots.map(voiceIntentSlotSanitizer)) }),
  }),
  (intent) => ({
    ...baseIntentSmartAdapter.toDB(intent),
    ...(hasValue(intent, 'slots') && { slots: denormalize(intent.slots).map(voiceIntentSlotSanitizer) }),
  })
);

export const voiceIntentAdapter = createMultiAdapter<
  VoiceModels.Intent<string>,
  VoiceIntent,
  BaseIntentAdapterFromDBOptions,
  BaseIntentAdapterToDBOptions
>(({ slots = [], ...dbIntent }, options) => voiceIntentSmartAdapter.fromDB({ slots, ...dbIntent }, options), voiceIntentSmartAdapter.toDB);
