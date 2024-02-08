import { ClientCRUDPayload, createCRUDActions, getCRUDActionTargets } from '@realtime-sdk/actions/utils';
import { Organization } from '@realtime-sdk/models';
import { BaseCreatorPayload, BaseOrganizationPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { Action, AnyAction } from 'typescript-fsa';

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

export interface ReplaceScheduledSubscriptionPayload extends BaseOrganizationPayload {
  subscription: Organization['subscription'];
}

export const crud = createCRUDActions<Organization, BaseCreatorPayload>(organizationType);

export const updateName = Utils.protocol.createAction<UpdateOrganizationNamePayload>(organizationType('UPDATE_NAME'));

export const updateImage = Utils.protocol.createAction<UpdateOrganizationImagePayload>(organizationType('UPDATE_IMAGE'));

export const replaceSubscription = Utils.protocol.createAction<ReplaceSubscriptionPayload>(organizationType('REPLACE_SUBSCRIPTION'));

export const replaceScheduledSubscription = Utils.protocol.createAction<ReplaceScheduledSubscriptionPayload>(
  organizationType('REPLACE_SCHEDULED_SUBSCRIPTION')
);

export const getTargetedOrganizations = (action: AnyAction): string[] | null => {
  const targets = getCRUDActionTargets(crud, action);
  if (targets) return targets;

  const organizationId = (action as Action<BaseOrganizationPayload | null>).payload?.organizationID;
  return organizationId ? [organizationId] : null;
};
