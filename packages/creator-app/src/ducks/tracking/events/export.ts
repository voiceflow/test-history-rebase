import client from '@/client';
import { ExportFormat } from '@/constants';

import { EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackExportButtonClick = createProjectEventTracker<{ format: ExportFormat }>((options) =>
  client.analytics.track(EventName.EXPORT_BUTTON_CLICK, createProjectEventPayload(options, { format: options.format }))
);
