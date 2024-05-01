import { Controller, Inject } from '@nestjs/common';
import { Subscription } from '@voiceflow/dtos';
import { Action, AuthMeta, type AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { BillingSubscriptionService } from './subscription.service';

@Controller()
@InjectRequestContext()
export class BillingSubscriptionLoguxController {
  constructor(@Inject(BillingSubscriptionService) private readonly service: BillingSubscriptionService) {}

  @Action.Async(Actions.OrganizationSubscription.Checkout)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.OrganizationSubscription.CheckoutRequest>(({ context }) => ({
    channel: Channels.organization.build(context),
  }))
  async checkout(
    @Payload() data: Actions.OrganizationSubscription.CheckoutRequest,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Subscription> {
    const { organizationID, workspaceID } = data.context;

    return this.service.checkoutAndBroadcast(authMeta, organizationID, workspaceID, data);
  }

  @Action(Actions.OrganizationSubscription.Replace)
  @Authorize.Permissions<Actions.OrganizationSubscription.Replace>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @Broadcast<Actions.OrganizationSubscription.Replace>(({ context }) => ({
    channel: Channels.organization.build(context),
  }))
  @BroadcastOnly()
  async replaceSubscription(@Payload() _: any) {
    // for broadcast only
  }
}
