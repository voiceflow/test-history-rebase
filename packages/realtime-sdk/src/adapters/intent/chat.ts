import { ChatIntent, ChatIntentSlot, ChatIntentSlotDialog } from '@realtime-sdk/models';
import { ChatModels } from '@voiceflow/chat-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter from 'bidirectional-adapter';
import { denormalize, normalize } from 'normal-store';
import { Optional, Required } from 'utility-types';

import { chatPromptAdapter } from '../creator/block/utils';
import { baseIntentAdapter, baseIntentSlotDialogSanitizer, baseIntentSlotSanitizer } from './base';

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

const chatIntentAdapter = createAdapter<ChatModels.Intent, ChatIntent, [{ platform: VoiceflowConstants.PlatformType }]>(
  ({ slots = [], ...baseIntent }, options) => ({
    ...baseIntentAdapter.fromDB(baseIntent, options),
    slots: normalize(slots.map(chatIntentSlotSanitizer)),
  }),
  ({ slots, ...baseIntent }) => ({
    ...baseIntentAdapter.toDB(baseIntent),
    slots: denormalize(slots).map(chatIntentSlotSanitizer),
  })
);

export default chatIntentAdapter;
