import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { OrganizationIdentityService } from './identity/identity.service';

@Controller('/organizations')
@ApiTags('Organization')
export class OrganizationHTTPController {
  constructor(@Inject(OrganizationIdentityService) private readonly service: OrganizationIdentityService) {}

  @Get('/:organizationID/workspaces')
  @Authorize.Permissions([Permission.ORGANIZATION_READ])
  @ZodApiResponse({ status: HttpStatus.OK })
  async getOrganizationWorkspaces(
    @Param('organizationID') organizationID: string
  ): Promise<Realtime.Identity.Workspace[]> {
    return this.service.getWorkspacesByOrganizationID(organizationID);
  }
}
