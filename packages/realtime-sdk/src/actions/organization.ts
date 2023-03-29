import { ClientCRUDPayload, createCRUDActions, getCRUDActionTargets } from '@realtime-sdk/actions/utils';
import { ORGANIZATION_KEY } from '@realtime-sdk/constants';
import { Organization } from '@realtime-sdk/models';
import { BaseCreatorPayload, BaseOrganizationPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { Action, AnyAction } from 'typescript-fsa';

const organizationType = Utils.protocol.typeFactory(ORGANIZATION_KEY);

export type ClientOrganizationCRUDPayload = ClientCRUDPayload<Organization, BaseCreatorPayload>;

export interface UpdateOrganizationNamePayload extends BaseOrganizationPayload {
  name: string;
}

export interface UpdateOrganizationImagePayload extends BaseOrganizationPayload {
  image: string;
}

export const crud = createCRUDActions<Organization, BaseCreatorPayload>(organizationType);

export const updateName = Utils.protocol.createAction<UpdateOrganizationNamePayload>(organizationType('UPDATE_NAME'));

export const updateImage = Utils.protocol.createAction<UpdateOrganizationImagePayload>(organizationType('UPDATE_IMAGE'));

export const getTargetedOrganizations = (action: AnyAction): string[] | null => {
  const targets = getCRUDActionTargets(crud, action);
  if (targets) return targets;

  const organizationId = (action as Action<BaseOrganizationPayload | null>).payload?.organizationID;
  return organizationId ? [organizationId] : null;
};
