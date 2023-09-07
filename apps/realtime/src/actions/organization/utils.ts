import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionAccessor, BaseContextData, Context, Resender } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';

type OrganizationPayload = Realtime.BaseOrganizationPayload | Realtime.organization.ClientOrganizationCRUDPayload;

export interface OrganizationContextData extends BaseContextData {
  organizationIDs: string[];
}

export const accessOrganizations = <P extends OrganizationPayload, D extends OrganizationContextData>(
  self: AbstractActionControl<P, D>
): ActionAccessor<P, D> =>
  async function (this: AbstractActionControl<P, D>, ctx: Context<OrganizationContextData>, action: Action<OrganizationPayload>): Promise<boolean> {
    const organizationIDs = Realtime.organization.getTargetedOrganizations(action);
    if (!organizationIDs) return false;

    ctx.data.organizationIDs = organizationIDs;

    const { creatorID } = ctx.data;

    return (await Promise.all(organizationIDs.map((organizationID) => self.services.organization.access.canWrite(creatorID, organizationID)))).every(
      Boolean
    );
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

export const resendOrganizationChannels: Resender<OrganizationPayload, OrganizationContextData> = (ctx, { payload }) => {
  let { organizationIDs } = ctx.data;

  // FIXME: special case to handle actions sent by the server that will not pass through the accessor
  if (!organizationIDs) {
    const { organizationID = null } = (payload as any) ?? {};

    if (!organizationID) return {};

    organizationIDs = [organizationID];
  }

  return {
    channels: organizationIDs.map((organizationID) => Realtime.Channels.organization.build({ organizationID })),
  };
};

export abstract class AbstractOrganizationChannelControl<
  P extends OrganizationPayload,
  D extends OrganizationContextData = OrganizationContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessOrganizations(this);

  protected resend: Resender<P, D> = resendOrganizationChannels;
}
