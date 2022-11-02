import * as Base from '@platform/configs/base';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import * as Models from '../models';

export type KeyRemap = Base.Adapters.Intent.KeyRemap;
export type ToDBOptions = Base.Adapters.Intent.ToDBOptions;
export type FromDBOptions = Base.Adapters.Intent.FromDBOptions;

export const promptSanitizer = ({ text, slots, voice }: Optional<Models.Intent.Prompt> = {}): Models.Intent.Prompt => ({
  text: text || '',
  slots: slots || [],
  voice,
});

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  ...Base.Adapters.Intent.slotDialogSanitizer(baseDialog),
  prompt: prompt.map(promptSanitizer),
  confirm: confirm.map(promptSanitizer),
});

export const slotSanitizer = ({ dialog, ...baseIntentSlot }: Required<Optional<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  ...Base.Adapters.Intent.slotSanitizer(baseIntentSlot),
  dialog: slotDialogSanitizer(dialog),
});

export const smart = createSmartMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model, FromDBOptions, ToDBOptions, KeyRemap>(
  (dbIntent, options) => ({
    ...Base.Adapters.Intent.smart.fromDB(dbIntent, options),
    ...(Base.Adapters.Utils.hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots.map(slotSanitizer)) }),
  }),
  (intent) => ({
    ...Base.Adapters.Intent.smart.toDB(intent),
    ...(Base.Adapters.Utils.hasValue(intent, 'slots') && { slots: denormalize(intent.slots).map(slotSanitizer) }),
  })
);

export const simple = createMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model, FromDBOptions, ToDBOptions>(
  ({ slots = [], ...dbIntent }, options) => smart.fromDB({ slots, ...dbIntent }, options),
  smart.toDB
);
