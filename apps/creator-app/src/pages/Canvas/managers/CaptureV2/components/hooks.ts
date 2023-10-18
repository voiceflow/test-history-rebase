import * as Realtime from '@voiceflow/realtime-sdk';
import { Entity } from '@voiceflow/sdk-logux-designer';
import { createDividerMenuItemOption, OptionsMenuOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { ENTIRE_USER_REPLY_ID, ENTIRE_USER_REPLY_LABEL } from './constants';

export interface EntityOption {
  id: string;
  name: string;
  label: string;
}

export const useEntitiesOptions = (
  unusedSlots: Array<Realtime.Slot | Entity>,
  slot: Realtime.Slot | Entity | null = null
): Array<EntityOption | UIOnlyMenuItemOption> => {
  return React.useMemo(() => {
    const entireUserReplyOption = { id: ENTIRE_USER_REPLY_ID, label: ENTIRE_USER_REPLY_LABEL, name: ENTIRE_USER_REPLY_LABEL };

    if (!unusedSlots.length && !slot) {
      return [entireUserReplyOption];
    }

    return [
      entireUserReplyOption,
      createDividerMenuItemOption(),
      ...(slot ? [{ id: slot.id, label: `{${slot.name}}`, name: slot.name }] : []),
      ...unusedSlots.map((slot) => ({ id: slot.id, label: `{${slot.name}}`, name: slot.name })),
    ];
  }, [slot, unusedSlots]);
};

export const useUtterancesOption = (shown: boolean, onChange: (changes: { utterancesShown: boolean }) => void): OptionsMenuOption => {
  return {
    label: shown ? 'Remove utterances' : 'Add utterances',
    onClick: () => onChange({ utterancesShown: !shown }),
  };
};
