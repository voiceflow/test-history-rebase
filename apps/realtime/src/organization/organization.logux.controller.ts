import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Channel, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext, UseRequestContext } from '@/common';

import { OrganizationService } from './organization.service';

@Controller()
@InjectRequestContext()
export class OrganizationLoguxController {
  constructor(@Inject(OrganizationService) private readonly organizationService: OrganizationService) {}

  @Channel(Channels.organization)
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  async subscribe() {
    // subscribe only. Organization channel is used only for authorization
  }

  @Action(Actions.Organization.PatchOne)
  @Authorize.Permissions<Actions.Organization.PatchOne>([Permission.ORGANIZATION_UPDATE], ({ id: organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  @UseRequestContext()
  @Broadcast<Actions.EntityVariant.PatchOne>(({ id }) => ({ channel: Channels.organization.build({ organizationID: id }) }))
  async patchOne(@Payload() { id, patch }: Actions.Organization.PatchOne): Promise<void> {
    await this.organizationService.patchOne(id, patch);
  }
}
