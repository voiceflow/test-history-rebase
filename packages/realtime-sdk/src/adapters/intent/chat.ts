import { Types } from '@voiceflow/chat-types';
import { PlatformType } from '@voiceflow/internal';
import { Optional, Required } from 'utility-types';

import { ChatIntent, ChatIntentSlot, ChatIntentSlotDialog } from '../../models';
import { denormalize, normalize } from '../../utils/normalized';
import { chatRepromptAdapter, createAdapter } from '../utils';
import { baseIntentAdapter, baseIntentSlotDialogSanitizer, baseIntentSlotSanitizer } from './base';

export const chatIntentSlotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<ChatIntentSlotDialog> = {}): ChatIntentSlotDialog => ({
  ...baseIntentSlotDialogSanitizer(baseDialog),
  prompt: chatRepromptAdapter.mapFromDB(prompt),
  confirm: chatRepromptAdapter.mapFromDB(confirm),
});

export const chatIntentSlotSanitizer = ({ dialog, ...baseIntentSlot }: Required<Optional<ChatIntentSlot>, 'id'>): ChatIntentSlot => ({
  ...baseIntentSlotSanitizer(baseIntentSlot),
  dialog: chatIntentSlotDialogSanitizer(dialog),
});

const chatIntentAdapter = createAdapter<Types.Intent, ChatIntent, [{ platform: PlatformType }]>(
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
