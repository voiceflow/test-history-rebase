import * as Realtime from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { ENTIRE_USER_REPLY_ID, ENTIRE_USER_REPLY_LABEL } from './constants';

export interface EntityOption {
  id: string;
  name: string;
  label: string;
}

export const useEntitiesOptions = (unusedSlots: Realtime.Slot[], slot: Realtime.Slot | null = null): Array<EntityOption | UIOnlyMenuItemOption> => {
  return React.useMemo(() => {
    const entireUserReplyOption = { id: ENTIRE_USER_REPLY_ID, label: ENTIRE_USER_REPLY_LABEL, name: ENTIRE_USER_REPLY_LABEL };

    if (!unusedSlots.length && !slot) {
      return [entireUserReplyOption];
    }

    return [
      entireUserReplyOption,
      createUIOnlyMenuItemOption('divider', { divider: true }),
      ...(slot ? [{ id: slot.id, label: `{${slot.name}}`, name: slot.name }] : []),
      ...unusedSlots.map((slot) => ({ id: slot.id, label: `{${slot.name}}`, name: slot.name })),
    ];
  }, [slot, unusedSlots]);
};
