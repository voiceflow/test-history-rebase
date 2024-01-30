import client from '@/client';

import { EventName } from '../../constants';
import { createProjectEvent, createProjectEventTracker } from '../../utils';

export const trackCMSFunctionsPageOpen = createProjectEventTracker(({ ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTIONS_PAGE_OPEN, { ...eventInfo }))
);

export const trackCMSFunctionsImported = createProjectEventTracker<{
  count: number;
  function_name?: string;
  function_names?: string[];
}>((eventInfo) => client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_IMPORTED, eventInfo)));

export const trackCMSFunctionsExported = createProjectEventTracker<{ count: number }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_EXPORTED, eventInfo))
);

export const trackCMSFunctionsDeleted = createProjectEventTracker<{ count: number }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_DELETED, eventInfo))
);

export const trackCMSFunctionDuplicated = createProjectEventTracker<{ functionID: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_DUPLICATED, eventInfo))
);

export const trackCMSFunctionCreated = createProjectEventTracker<{ functionID: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_CREATED, eventInfo))
);

export const trackCMSFunctionsTestExecuted = createProjectEventTracker<{ Success: 'Yes' | 'No' }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_TEST_EXECUTED, eventInfo))
);

export const trackCMSFunctionsError = createProjectEventTracker<{ ErrorType: 'Import' | 'Create' | 'Duplicate' | 'Execute' | 'Export' }>(
  (eventInfo) => client.analytics.track(createProjectEvent(EventName.CMS_FUNCTION_ERROR, eventInfo))
);
