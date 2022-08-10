import React from 'react';

import { IntentNotificationTypes } from '@/pages/NLUManager/types';

export interface NLUNotificationItem {
  type: IntentNotificationTypes;
  title: string;
  message: React.ReactNode;
  itemID: string;
}
