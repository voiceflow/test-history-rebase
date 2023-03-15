import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';

import client from '@/client';

import { EventName } from '../constants';
import { createVersionEvent, createVersionEventTracker, createWorkspaceEvent, createWorkspaceEventTracker } from '../utils';

export const trackDomainDeleted = createVersionEventTracker<{ domainID: string }>(({ domainID, ...eventInfo }) =>
  client.analytics.track(createVersionEvent(EventName.DOMAIN_DELETED, { ...eventInfo, domain_id: domainID }))
);

export const trackDomainCreated = createVersionEventTracker<{ domainID: string }>(({ domainID, ...eventInfo }) =>
  client.analytics.track(createVersionEvent(EventName.DOMAIN_CREATED, { ...eventInfo, domain_id: domainID }))
);

export const trackDomainDuplicated = createVersionEventTracker<{ domainID: string }>(({ domainID, ...eventInfo }) =>
  client.analytics.track(createVersionEvent(EventName.DOMAIN_DUPLICATED, { ...eventInfo, domain_id: domainID }))
);

export const trackDomainConvert = createWorkspaceEventTracker<{
  sourceNLUType?: Platform.Constants.NLUType;
  targetNLUType?: Platform.Constants.NLUType;
  sourcePlatform?: Platform.Constants.PlatformType;
  targetPlatform?: Platform.Constants.PlatformType;
  sourceProjectID: string;
  targetProjectID: string;
}>(({ sourceNLUType, targetNLUType, sourcePlatform, targetPlatform, sourceProjectID, targetProjectID, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.DOMAIN_CONVERT, {
      ...eventInfo,
      origin_nlu_type: sourceNLUType,
      origin_platform: sourcePlatform,
      origin_project_id: sourceProjectID,
      destination_nlu_type: targetNLUType,
      destination_platform: targetPlatform,
      destination_project_id: targetProjectID,
    })
  )
);

export const trackDomainStatusChanged = createVersionEventTracker<{ domainID: string; status: BaseModels.Version.DomainStatus }>(
  ({ domainID, ...eventInfo }) => client.analytics.track(createVersionEvent(EventName.DOMAIN_STATUS_CHANGED, { ...eventInfo, domain_id: domainID }))
);
