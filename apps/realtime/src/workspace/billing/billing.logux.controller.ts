import { Controller, Inject, Logger } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Context, LoguxService, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';
import { AxiosError } from 'axios';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';
import { OrganizationIdentityService } from '@/organization/identity/identity.service';
import { AsyncActionError } from '@/utils/logux.util';

import { WorkspaceService } from '../workspace.service';
import { WorkspaceBillingService } from './billing.service';

@Controller()
@InjectRequestContext()
export class WorkspaceBillingLoguxController {
  private readonly logger = new Logger(WorkspaceBillingLoguxController.name);

  constructor(
    @Inject(WorkspaceBillingService)
    private readonly workspaceBillingService: WorkspaceBillingService,
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(OrganizationIdentityService)
    private readonly organizationService: OrganizationIdentityService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  @Action(Realtime.workspace.quotas.refreshQuotaDetails)
  @Authorize.Permissions<Realtime.workspace.quotas.RefreshQuotaDetailsPayload>(
    [Permission.WORKSPACE_READ],
    ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' })
  )
  @Broadcast<Realtime.workspace.quotas.RefreshQuotaDetailsPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @UseRequestContext()
  async refreshQuotaDetails(
    @Payload() payload: Realtime.workspace.quotas.RefreshQuotaDetailsPayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    const { workspaceID, quotaName } = payload;

    const quotaDetails = await this.workspaceBillingService.getQuotaByName(authMeta.userID, workspaceID, quotaName);

    if (!quotaDetails) return;

    await this.logux.processAs(Realtime.workspace.quotas.replaceQuota({ workspaceID, quotaDetails }), authMeta);
  }

  @Action(Realtime.workspace.quotas.loadAll)
  @Broadcast<Realtime.workspace.quotas.LoadQuotasPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async loadAll(@Payload() _: Realtime.workspace.quotas.LoadQuotasPayload) {
    // for broadcast only
  }

  @Action(Realtime.workspace.quotas.replaceQuota)
  @Broadcast<Realtime.workspace.quotas.replaceQuotaPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async replaceQuota(@Payload() _: Realtime.workspace.quotas.replaceQuotaPayload) {
    // for broadcast only
  }

  @Action(Realtime.workspace.changeSeats)
  @Authorize.Permissions<Realtime.workspace.ChangeSeatsPayload>(
    [Permission.WORKSPACE_BILLING_UPDATE],
    ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' })
  )
  @UseRequestContext()
  async changeSeats(@Payload() payload: Realtime.workspace.ChangeSeatsPayload, @AuthMeta() authMeta: AuthMetaPayload) {
    const { seats, schedule, workspaceID } = payload;

    await this.workspaceBillingService.changeSeats(authMeta.userID, workspaceID, { seats, schedule });
  }

  @Action.Async(Realtime.workspace.checkout)
  @Authorize.Permissions<Realtime.workspace.CheckoutPayload>(
    [Permission.WORKSPACE_BILLING_UPDATE],
    ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' })
  )
  @UseRequestContext()
  async checkout(
    @Context() ctx: Context.Action,
    @Payload() payload: Realtime.workspace.CheckoutPayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    try {
      await this.workspaceBillingService.checkout(authMeta.userID, payload);
      await this.onSubscriptionUpdate(payload.workspaceID, authMeta, ctx);

      return null;
    } catch (error) {
      if ((error as any).statusCode === 402) {
        throw new AsyncActionError({
          message: 'Failed to upgrade, please try again later',
          code: Realtime.ErrorCode.CHECKOUT_FAILED,
        });
      }

      this.logger.error(error, '[checkout]');
      throw error;
    }
  }

  @Action.Async(Realtime.workspace.downgradeTrial)
  @Authorize.Permissions<Realtime.workspace.DowngradeTrialPayload>(
    [Permission.WORKSPACE_BILLING_UPDATE],
    ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' })
  )
  @UseRequestContext()
  async downgradeTrial(
    @Context() ctx: Context.Action,
    @Payload() payload: Realtime.workspace.DowngradeTrialPayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    try {
      await this.workspaceBillingService.downgradeTrial(authMeta.userID, payload.workspaceID);
      await this.onSubscriptionUpdate(payload.workspaceID, authMeta, ctx);

      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        throw new AsyncActionError({
          message: 'Failed to downgrade subscription, please try again later',
          code: Realtime.ErrorCode.CHECKOUT_FAILED,
        });
      }
      this.logger.error(error, '[downgradeTrial]');
      throw error;
    }
  }

  private async onSubscriptionUpdate(workspaceID: string, authMeta: AuthMetaPayload, ctx: Context.Action) {
    const [workspace, organizations] = await Promise.all([
      this.workspaceService.findOne(authMeta.userID, workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB),
      this.organizationService.getAll(authMeta.userID),
    ]);

    await Promise.all([
      ctx.sendBack(Realtime.workspace.crud.update({ key: workspaceID, value: workspace })),
      ctx.sendBack(Actions.Organization.Replace({ data: organizations })),
    ]);

    const quota = await this.workspaceBillingService.changeQuotaPlan(
      authMeta.userID,
      workspaceID,
      Realtime.QuotaNames.TOKENS
    );

    if (quota) {
      await this.logux.processAs(
        Realtime.workspace.quotas.replaceQuota({ workspaceID, quotaDetails: quota }),
        authMeta
      );
    }
  }
}
