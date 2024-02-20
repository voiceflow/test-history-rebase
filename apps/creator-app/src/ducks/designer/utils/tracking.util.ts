import { Utils } from '@voiceflow/common';

import client from '@/client';
import { VersionEventInfo } from '@/ducks/tracking/types';
import { createVersionEvent, createVersionEventTracker } from '@/ducks/tracking/utils';
import { Thunk } from '@/store/types';

export const cmsTrackingNameBuilderFactory = (scope: string) => {
  const prefix = `CMS - ${scope}`;

  const factory = (event: string) => `${prefix} ${event}`;

  return Object.assign(factory, {
    ERROR: factory('Error'),
    CREATED: factory('Created'),
    DELETED: factory('Deleted'),
    UPDATED: factory('Updated'),
    IMPORTED: factory('Imported'),
    EXPORTED: factory('Exported'),
    PAGE_OPEN: factory('Page Open'),
    DUPLICATED: factory('Duplicated'),
  });
};

export const cmsTrackingFactory = (scope: string) => {
  const nameBuilder = cmsTrackingNameBuilderFactory(scope);

  const error = createVersionEventTracker<{ errorType: 'Import' | 'Create' | 'Duplicate' | 'Export' | 'Delete' | (string & {}) }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.ERROR, eventInfo))
  );

  const created = createVersionEventTracker<{ id: string }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.CREATED, eventInfo))
  );

  const deleted = createVersionEventTracker<{ count: number }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.DELETED, eventInfo))
  );

  const updated = createVersionEventTracker<{ id: string } | { ids: string[] }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.UPDATED, eventInfo))
  );

  const imported = createVersionEventTracker<{ names: string[] }>(
    (eventInfo) =>
      eventInfo.names.length && client.analytics.track(createVersionEvent(nameBuilder.IMPORTED, { ...eventInfo, count: eventInfo.names.length }))
  );

  const exported = createVersionEventTracker<{ count: number }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.EXPORTED, eventInfo))
  );

  const pageOpen = createVersionEventTracker((eventInfo) => client.analytics.track(createVersionEvent(nameBuilder.PAGE_OPEN, eventInfo)));

  const duplicated = createVersionEventTracker<{ id: string }>((eventInfo) =>
    client.analytics.track(createVersionEvent(nameBuilder.DUPLICATED, eventInfo))
  );

  const tracker = <T>(action: string, extractData: (data: VersionEventInfo & T, ...args: Parameters<Thunk>) => object = (data) => data) =>
    createVersionEventTracker<T>((eventInfo, ...args) =>
      client.analytics.track(
        createVersionEvent(nameBuilder(action), {
          ...extractData(eventInfo, ...args),
          ...Utils.object.pick(eventInfo, [
            'nluType',
            'nluType',
            'platform',
            'versionID',
            'projectID',
            'creatorID',
            'workspaceID',
            'projectType',
            'organizationID',
          ]),
        })
      )
    );

  return Object.assign(tracker, {
    error,
    created,
    deleted,
    updated,
    imported,
    exported,
    pageOpen,
    duplicated,
  });
};
