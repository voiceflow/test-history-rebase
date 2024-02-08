import type { ClientCRUDPayload } from '@realtime-sdk/actions/utils';
import { createCRUDActions } from '@realtime-sdk/actions/utils';
import type { BaseCreatorPayload, BaseOrganizationPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { organizationType } from './utils';

export * as member from './member';

export type ClientOrganizationCRUDPayload = ClientCRUDPayload<Organization, BaseCreatorPayload>;

export interface ReplaceSubscriptionPayload extends BaseOrganizationPayload {
  subscription: Organization['subscription'];
}

export const replaceSubscription = Utils.protocol.createAsyncAction<ReplaceSubscriptionPayload>(
  organizationType('REPLACE_SUBSCRIPTION')
);
