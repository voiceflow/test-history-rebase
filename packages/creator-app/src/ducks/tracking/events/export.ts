import client from '@/client';
import { ExportFormat } from '@/constants';

import { EventName } from '../constants';
import { createVersionEvent, createVersionEventTracker } from '../utils';

export const trackExportButtonClick = createVersionEventTracker<{ format: ExportFormat }>((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.EXPORT_BUTTON_CLICK, eventInfo))
);
