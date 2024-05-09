import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Channel, Context, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

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
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ workspaceID }) => ({
    // permission system doesn't support workspace members reading org resources.
    // Passing workspace resource will resolve into an organization resource lookup, which then works.
    id: workspaceID,
    kind: 'workspace',
  }))
  async subscribe(@Context() ctx: Context.Channel<Channels.OrganizationParams>) {
    const { organizationID } = ctx.params;
    const [subscriptionMeta, takenSeatsMeta] = [{ id: ctx.server.log.generateId() }, { id: ctx.server.log.generateId() }];

    const [subscription, takenSeats] = await Promise.all([
      this.billingSubscriptionService
        .findOneByOrganizationID(organizationID)
        .then(subscriptionAdapter.fromDB)
        .catch(() => null),
      this.organizationService.getTakenSeats(organizationID),
    ]);

    return subscription
      ? [
          [Actions.OrganizationSubscription.Replace({ subscription, context: ctx.params }), subscriptionMeta],
          [Actions.OrganizationTakenSeats.Replace({ takenSeats, context: ctx.params }), takenSeatsMeta],
        ]
      : [];
  }

  @Action(Actions.Organization.PatchOne)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.ORGANIZATION_UPDATE], ({ id: organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.Organization.PatchOne>(({ context }) => ({ channel: Channels.organization.build(context) }))
  async patchOne(@Payload() { id, patch }: Actions.Organization.PatchOne, @AuthMeta() authMeta: AuthMetaPayload): Promise<void> {
    await this.organizationService.patchOne(authMeta.userID, id, patch);
  }

  @Action(Actions.OrganizationMember.DeleteOne)
  @Authorize.Permissions<Actions.OrganizationMember.DeleteOne>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.OrganizationMember.DeleteOne>(({ context }) => ({ channel: Channels.organization.build(context) }))
  async deleteMember(@Payload() { id, context }: Actions.OrganizationMember.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload): Promise<void> {
    await this.organizationMemberService.remove(authMeta.userID, context.organizationID, id);
  }

  @Action(Actions.OrganizationTakenSeats.Replace)
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ workspaceID }) => ({
    // permission system doesn't support workspace members reading org resources.
    // Passing workspace resource will resolve into an organization resource lookup, which then works.
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Actions.OrganizationTakenSeats.Replace>(({ context }) => ({
    channel: Channels.organization.build(context),
  }))
  @BroadcastOnly()
  async replaceTakenSeats(@Payload() _: any) {
    // for broadcast only
  }
}
