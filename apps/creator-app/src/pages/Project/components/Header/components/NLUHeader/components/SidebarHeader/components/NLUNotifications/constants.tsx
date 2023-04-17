import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { IntentNotificationTypes, NLUIntent } from '@/pages/NLUManager/types';

export const NOTIFICATION_TITLE: Record<IntentNotificationTypes, string> = {
  [IntentNotificationTypes.ENTITY_PROMPT]: 'Entity reprompt missing',
  [IntentNotificationTypes.CONFIDENCE]: 'Confidence is low',
  [IntentNotificationTypes.CLARITY]: 'Clarity is low',
};

export const getNotificationMessage: Record<IntentNotificationTypes, (intent: NLUIntent) => React.ReactNode> = {
  [IntentNotificationTypes.ENTITY_PROMPT]: (intent) => (
    <span>
      <b>{intent.name}</b> intent contains entities with no default prompt
    </span>
  ),
  [IntentNotificationTypes.CONFIDENCE]: (intent) => (
    <span>
      <b>{intent.name}</b> intent needs more utterances. Consider adding more.
    </span>
  ),
  [IntentNotificationTypes.CLARITY]: (intent) => (
    <span>
      <b>{intent.name}</b> conflicts with other utterances in {intent.conflictingIntentIDs.length} other intents.
    </span>
  ),
};

export const NOTIFICATION_ITEM_ICONS: Record<IntentNotificationTypes, SvgIconTypes.Icon> = {
  [IntentNotificationTypes.ENTITY_PROMPT]: 'setV2',
  [IntentNotificationTypes.CLARITY]: 'intent',
  [IntentNotificationTypes.CONFIDENCE]: 'variables',
};

export const NOTIFICATION_TAB: Record<IntentNotificationTypes, InteractionModelTabType> = {
  [IntentNotificationTypes.ENTITY_PROMPT]: InteractionModelTabType.SLOTS,
  [IntentNotificationTypes.CLARITY]: InteractionModelTabType.INTENTS,
  [IntentNotificationTypes.CONFIDENCE]: InteractionModelTabType.VARIABLES,
};
