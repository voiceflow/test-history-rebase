import { Controller, Inject } from '@nestjs/common';
import { Subscription } from '@voiceflow/dtos';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
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
    channel: Channels.organization.build({ ...context, workspaceID: '' }),
  }))
  async checkout(@Payload() data: Actions.OrganizationSubscription.CheckoutRequest, @AuthMeta() authMeta: AuthMetaPayload): Promise<Subscription> {
    const { organizationID } = data.context;

    const { itemPriceID, planPrice, editorSeats, period, paymentIntent } = data;

    return this.service.checkoutAndBroadcast(authMeta, organizationID, {
      itemPriceID,
      planPrice,
      editorSeats,
      period,
      paymentIntent,
    });
  }

  @Action(Actions.OrganizationSubscription.Replace)
  @Authorize.Permissions<Actions.OrganizationSubscription.Replace>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @Broadcast<Actions.OrganizationSubscription.Replace>(({ context }) => ({
    channel: Channels.organization.build({ ...context, workspaceID: '' }),
  }))
  @BroadcastOnly()
  async replaceSubscription(@Payload() _: any) {
    // for broadcast only
  }
}
