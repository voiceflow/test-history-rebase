import client from '@/client';
import { ExportFormat } from '@/constants';

import { EventName } from '../constants';
import { createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackExportButtonClick = createVersionEventTracker<{ format: ExportFormat }>((options) =>
  client.api.analytics.track(EventName.EXPORT_BUTTON_CLICK, createVersionEventPayload(options, { format: options.format }))
);
