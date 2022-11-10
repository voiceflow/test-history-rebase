import * as Base from '@platform-config/configs/base';
import { ChatModels } from '@voiceflow/chat-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import * as Models from '../models';
import * as PromptAdapter from './prompt';

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  ...Base.Adapters.Intent.slotDialogSanitizer(baseDialog),
  prompt: PromptAdapter.simple.mapFromDB(prompt),
  confirm: PromptAdapter.simple.mapFromDB(confirm),
});

export const slotSanitizer = ({ dialog, ...baseIntentSlot }: Required<Optional<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  ...Base.Adapters.Intent.slotSanitizer(baseIntentSlot),
  dialog: slotDialogSanitizer(dialog),
});

export const smart = createSmartMultiAdapter<ChatModels.Intent, Models.Intent.Model, [], [], Base.Adapters.Intent.KeyRemap>(
  (dbIntent) => ({
    ...Base.Adapters.Intent.smart.fromDB(dbIntent),
    ...(Base.Adapters.Utils.hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots.map(slotSanitizer)) }),
  }),
  (intent) => ({
    ...Base.Adapters.Intent.smart.toDB(intent),
    ...(Base.Adapters.Utils.hasValue(intent, 'slots') && { slots: denormalize(intent.slots).map(slotSanitizer) }),
  })
);

export const simple = createMultiAdapter<ChatModels.Intent, Models.Intent.Model>(
  ({ slots = [], ...dbIntent }) => smart.fromDB({ slots, ...dbIntent }),
  smart.toDB
);
