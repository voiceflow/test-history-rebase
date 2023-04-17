import { StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel } from '@/utils/intent';

import { IntentNotification, IntentNotificationTypes, NLUIntent } from '../types';

const useNotifications = (nluIntents: NLUIntent[]) => {
  return React.useMemo(() => {
    const notifications: IntentNotification[] = [];
    nluIntents.forEach((intent) => {
      const isConfidenceLevel = getIntentConfidenceStrengthLevel(intent.confidence);
      const isClarityLevel = getIntentClarityStrengthLevel(intent.clarity);

      if (!intent.hasConflicts) return;

      if (isConfidenceLevel === StrengthGauge.Level.WEAK) {
        notifications.push({
          intent,
          type: IntentNotificationTypes.CONFIDENCE,
        });
      }

      if (isClarityLevel === StrengthGauge.Level.WEAK) {
        notifications.push({
          intent,
          type: IntentNotificationTypes.CLARITY,
        });
      }
    });
    return notifications;
  }, [nluIntents]);
};

export default useNotifications;
