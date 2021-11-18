import { ChatIntent, ChatIntentSlot, ChatIntentSlotDialog } from '@realtime-sdk/models';
import { Types } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import createAdapter from 'bidirectional-adapter';
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

const chatIntentAdapter = createAdapter<Types.Intent, ChatIntent, [{ platform: Constants.PlatformType }]>(
  ({ slots = [], ...baseIntent }, options) => ({
    ...baseIntentAdapter.fromDB(baseIntent, options),
    slots: Utils.normalized.normalize(slots.map(chatIntentSlotSanitizer)),
  }),
  ({ slots, ...baseIntent }) => ({
    ...baseIntentAdapter.toDB(baseIntent),
    slots: Utils.normalized.denormalize(slots).map(chatIntentSlotSanitizer),
  })
);

export default chatIntentAdapter;
