import type { ClientCRUDPayload } from '@realtime-sdk/actions/utils';
import { createCRUDActions } from '@realtime-sdk/actions/utils';
import type { BaseCreatorPayload, BaseOrganizationPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { organizationType } from './utils';

export * as member from './member';

export type ClientOrganizationCRUDPayload = ClientCRUDPayload<Organization, BaseCreatorPayload>;

export interface UpdateOrganizationNamePayload extends BaseOrganizationPayload {
  name: string;
}

export interface UpdateOrganizationImagePayload extends BaseOrganizationPayload {
  image: string;
}

export interface ReplaceSubscriptionPayload extends BaseOrganizationPayload {
  subscription: Organization['subscription'];
}

export const crud = createCRUDActions<Organization, BaseCreatorPayload>(organizationType);

export const updateName = Utils.protocol.createAsyncAction<UpdateOrganizationNamePayload>(
  organizationType('UPDATE_NAME')
);

export const updateImage = Utils.protocol.createAsyncAction<UpdateOrganizationImagePayload>(
  organizationType('UPDATE_IMAGE')
);

export const replaceSubscription = Utils.protocol.createAsyncAction<ReplaceSubscriptionPayload>(
  organizationType('REPLACE_SUBSCRIPTION')
);
