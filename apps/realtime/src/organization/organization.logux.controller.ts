import { ChannelContext } from '@logux/server';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Channel, Context, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext, UseRequestContext } from '@/common';

import subscriptionAdapter from './billing/subscription/adapters/subscription.adapter';
import { BillingSubscriptionService } from './billing/subscription/subscription.service';
import { OrganizationMemberService } from './member/organization-member.service';
import { OrganizationService } from './organization.service';

@Controller()
@InjectRequestContext()
export class OrganizationLoguxController {
  constructor(
    @Inject(OrganizationService) private readonly organizationService: OrganizationService,
    @Inject(OrganizationMemberService) private readonly organizationMembersService: OrganizationMemberService,
    @Inject(BillingSubscriptionService) private readonly billingSubscriptionService: BillingSubscriptionService
  ) {}

  @Channel(Channels.organization)
  @Authorize.Permissions<ChannelContext<{ workspaceID: string }, Channels.OrganizationParams, any>>(
    [Permission.ORGANIZATION_READ],
    ({ data }) => ({
      // permission system doesn't support workspace members reading org resources.
      // Passing workspace resource will resolve into an organization resource lookup, which then works.
      id: data.workspaceID,
      kind: 'workspace',
    })
  )
  async subscribe(@Context() ctx: Context.Channel<Channels.OrganizationParams>) {
    const { organizationID } = ctx.params;
    const subscriptionMeta = { id: ctx.server.log.generateId() };
    const membersMeta = { id: ctx.server.log.generateId() };

    const [subscription, members] = await Promise.all([
      this.billingSubscriptionService
        .findOneByOrganizationID(organizationID)
        .then(subscriptionAdapter.fromDB)
        .catch(() => null),
      this.organizationMembersService.getAll(organizationID),
    ]);

    return [
      subscription
        ? [Actions.OrganizationSubscription.Replace({ subscription, context: ctx.params }), subscriptionMeta]
        : null,
      [Actions.OrganizationMember.Replace({ context: ctx.params, data: members }), membersMeta],
    ];
  }

  @Action(Actions.Organization.PatchOne)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.ORGANIZATION_UPDATE], ({ id: organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.Organization.PatchOne>(({ context }) => ({ channel: Channels.organization.build(context) }))
  async patchOne(
    @Payload() { id, patch }: Actions.Organization.PatchOne,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<void> {
    await this.organizationService.patchOne(authMeta.userID, id, patch);
  }

  @Action(Actions.OrganizationMember.DeleteOne)
  @Authorize.Permissions<Actions.OrganizationMember.DeleteOne>([Permission.ORGANIZATION_UPDATE], ({ context }) => ({
    id: context.organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.OrganizationMember.DeleteOne>(({ context }) => ({ channel: Channels.organization.build(context) }))
  async deleteMember(
    @Payload() { id, context }: Actions.OrganizationMember.DeleteOne,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<void> {
    await this.organizationMembersService.remove(authMeta.userID, context.organizationID, id);
  }
}
