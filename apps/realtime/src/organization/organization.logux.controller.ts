import { Controller, Inject } from '@nestjs/common';
import { Subscription } from '@voiceflow/dtos';
import { Action, Broadcast, Channel, Context, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext, UseRequestContext } from '@/common';

import subscriptionAdapter from './billing/subscription/adapters/subscription.adapter';
import { BillingSubscriptionService } from './billing/subscription/subscription.service';
import { OrganizationService } from './organization.service';

@Controller()
@InjectRequestContext()
export class OrganizationLoguxController {
  constructor(
    @Inject(OrganizationService) private readonly organizationService: OrganizationService,
    @Inject(BillingSubscriptionService) private readonly billingSubscriptionService: BillingSubscriptionService
  ) {}

  @Channel(Channels.organization)
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  async subscribe(@Context() ctx: Context.Channel<Channels.OrganizationParams>) {
    const { subscriptionID } = ctx.params;
    const [subscriptionsMeta] = [{ id: ctx.server.log.generateId() }];
    let subscription: Subscription | null = null;

    if (subscriptionID) {
      subscription = await this.billingSubscriptionService
        .findOne(subscriptionID)
        .then(subscriptionAdapter.fromDB)
        .catch(() => null);
    }

    return [[Actions.OrganizationSubscription.Replace({ subscription, context: ctx.params }), subscriptionsMeta]];
  }

  @Action(Actions.Organization.PatchOne)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.ORGANIZATION_UPDATE], ({ id: organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.Organization.PatchOne>(({ context }) => ({
    channel: Channels.organization.build({ ...context, subscriptionID: context.subscriptionID ?? '' }),
  }))
  async patchOne(@Payload() { id, patch }: Actions.Organization.PatchOne): Promise<void> {
    await this.organizationService.patchOne(id, patch);
  }
}
