import { ChatIntent, ChatIntentSlot, ChatIntentSlotDialog } from '@realtime-sdk/models';
import { ChatModels } from '@voiceflow/chat-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import { chatPromptAdapter } from '../creator/block/utils';
import { hasValue } from '../utils';
import { BaseIntentAdapterKeyRemap, baseIntentSlotDialogSanitizer, baseIntentSlotSanitizer, baseIntentSmartAdapter } from './base';

export const chatIntentSlotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<ChatIntentSlotDialog> = {}): ChatIntentSlotDialog => ({
  ...baseIntentSlotDialogSanitizer(baseDialog),
  prompt: chatPromptAdapter.mapFromDB(prompt),
  confirm: chatPromptAdapter.mapFromDB(confirm),
});

export const chatIntentSlotSanitizer = ({ dialog, ...baseIntentSlot }: Required<Optional<ChatIntentSlot>, 'id'>): ChatIntentSlot => ({
  ...baseIntentSlotSanitizer(baseIntentSlot),
  dialog: chatIntentSlotDialogSanitizer(dialog),
});

export const chatIntentSmartAdapter = createSmartMultiAdapter<ChatModels.Intent, ChatIntent, [], [], BaseIntentAdapterKeyRemap>(
  (dbIntent) => ({
    ...baseIntentSmartAdapter.fromDB(dbIntent),
    ...(hasValue(dbIntent, 'slots') && { slots: normalize(dbIntent.slots.map(chatIntentSlotSanitizer)) }),
  }),
  (intent) => ({
    ...baseIntentSmartAdapter.toDB(intent),
    ...(hasValue(intent, 'slots') && { slots: denormalize(intent.slots).map(chatIntentSlotSanitizer) }),
  })
);

export const chatIntentAdapter = createMultiAdapter<ChatModels.Intent, ChatIntent>(
  ({ slots = [], ...dbIntent }) => chatIntentSmartAdapter.fromDB({ slots, ...dbIntent }),
  chatIntentSmartAdapter.toDB
);
