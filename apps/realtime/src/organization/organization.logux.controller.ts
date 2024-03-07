import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Channel, Context, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext, UseRequestContext } from '@/common';

import subscriptionAdapter from './billing/subscription/adapters/subscription.adapter';
import { BillingSubscriptionService } from './billing/subscription/subscription.service';
import { OrganizationIdentityService } from './identity/identity.service';
import { OrganizationIdentityMemberService } from './identity/member.service';

@Controller()
@InjectRequestContext()
export class OrganizationLoguxController {
  constructor(
    @Inject(OrganizationIdentityService) private readonly organizationService: OrganizationIdentityService,
    @Inject(BillingSubscriptionService) private readonly billingSubscriptionService: BillingSubscriptionService,
    @Inject(OrganizationIdentityMemberService) private readonly organizationMemberService: OrganizationIdentityMemberService
  ) {}

  @Channel(Channels.organization)
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  async subscribe(@Context() ctx: Context.Channel<Channels.OrganizationParams>) {
    const { subscriptionID } = ctx.params;
    const [subscriptionsMeta] = [{ id: ctx.server.log.generateId() }];

    if (subscriptionID) {
      const subscription = await this.billingSubscriptionService
        .findOne(subscriptionID)
        .then(subscriptionAdapter.fromDB)
        .catch(() => null);

      return [[Actions.OrganizationSubscription.Replace({ subscription, context: ctx.params }), subscriptionsMeta]];
    }

    return [];
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
  async patchOne(@Payload() { id, patch }: Actions.Organization.PatchOne, @AuthMeta() authMeta: AuthMetaPayload): Promise<void> {
    await this.organizationService.patchOne(authMeta.userID, id, patch);
  }

  @Action(Actions.OrganizationMember.DeleteOne)
  @Authorize.Permissions<Actions.OrganizationMember.DeleteOne>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.OrganizationMember.DeleteOne>(({ context }) => ({
    channel: Channels.organization.build({ ...context, subscriptionID: context.subscriptionID ?? '' }),
  }))
  async deleteMember(@Payload() { id, context }: Actions.OrganizationMember.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload): Promise<void> {
    await this.organizationMemberService.remove(authMeta.userID, context.organizationID, id);
  }
}
