import * as Base from '@platform-config/configs/base';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter, createSmartMultiAdapter, MultiAdapter, SmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import * as Models from '../models';

export type KeyRemap = Base.Adapters.Intent.KeyRemap;

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

export const smart = createSmartMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model, [], [], KeyRemap>(
  (dbIntent) => ({
    ...Base.Adapters.Intent.smart.fromDB(dbIntent),
    ...(Base.Adapters.Utils.hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots.map(slotSanitizer)) }),
  }),
  (intent) => ({
    ...Base.Adapters.Intent.smart.toDB(intent),
    ...(Base.Adapters.Utils.hasValue(intent, 'slots') && { slots: denormalize(intent.slots).map(slotSanitizer) }),
  })
);

export const simple = createMultiAdapter<VoiceModels.Intent<string>, Models.Intent.Model>(
  ({ slots = [], ...dbIntent }) => smart.fromDB({ slots, ...dbIntent }),
  smart.toDB
);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const smartFactory = <Voice extends string>() =>
  smart as unknown as SmartMultiAdapter<VoiceModels.Intent<Voice>, Models.Intent.Model<Voice>, [], [], KeyRemap>;

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() => simple as unknown as MultiAdapter<VoiceModels.Intent<Voice>, Models.Intent.Model<Voice>>;
