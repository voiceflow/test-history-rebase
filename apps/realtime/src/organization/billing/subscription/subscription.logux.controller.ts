import { Controller, Inject } from '@nestjs/common';
import { Subscription } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
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
    channel: Channels.organization.build({ ...context, subscriptionID: context.subscriptionID ?? '' }),
  }))
  async checkout(@Payload() data: Actions.OrganizationSubscription.CheckoutRequest, @AuthMeta() authMeta: AuthMetaPayload): Promise<Subscription> {
    const { subscriptionID, organizationID } = data.context;

    // TODO: make subscription required
    if (!subscriptionID) {
      throw new Error('Subscription is required');
    }

    const { itemPriceID, planPrice, editorSeats, period, card } = data;

    // TODO: just adding this here because we'll move logic to use temp token
    if (!card) {
      throw new Error('Card is required');
    }

    return this.service.checkoutAndBroadcast(
      authMeta,
      organizationID,
      subscriptionID,
      {
        itemPriceID,
        planPrice,
        editorSeats,
        period: period as BillingPeriod,
      },
      card
    );
  }

  @Action(Actions.OrganizationSubscription.Replace)
  @Authorize.Permissions<Actions.OrganizationSubscription.Replace>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @Broadcast<Actions.OrganizationSubscription.Replace>(({ context }) => ({
    channel: Channels.organization.build({ ...context, subscriptionID: context.subscriptionID ?? '' }),
  }))
  @BroadcastOnly()
  async replaceSubscription(@Payload() _: any) {
    // for broadcast only
  }
}
