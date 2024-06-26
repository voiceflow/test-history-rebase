import { Controller, Inject } from '@nestjs/common';
import { Subscription } from '@voiceflow/dtos';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, LoguxService, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { BillingSubscriptionService } from './subscription.service';

@Controller()
@InjectRequestContext()
export class BillingSubscriptionLoguxController {
  constructor(
    @Inject(BillingSubscriptionService) private readonly service: BillingSubscriptionService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  @Action.Async(Actions.OrganizationSubscription.Checkout)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.WORKSPACE_BILLING_UPDATE], ({ context }) => ({
    id: context.workspaceID,
    kind: 'workspace',
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

    const subscription = await this.service.checkout(organizationID, data);

    await this.logux.processAs(
      Actions.OrganizationSubscription.Replace({
        subscription,
        context: { organizationID, workspaceID },
      }),
      authMeta
    );

    return subscription;
  }

  @Action(Actions.OrganizationSubscription.Replace)
  @Authorize.Permissions<Actions.OrganizationSubscription.Replace>([Permission.ORGANIZATION_READ], ({ context }) => ({
    id: context.workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Actions.OrganizationSubscription.Replace>(({ context }) => ({
    channel: Channels.organization.build(context),
  }))
  @BroadcastOnly()
  async replaceSubscription(@Payload() _: any) {
    // for broadcast only
  }
}
