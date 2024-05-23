import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrganizationMemberDTO } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { IdentityClient } from '@voiceflow/sdk-identity';
import type { Request } from 'express';

@Controller('/organizations/:organizationID/members')
@ApiTags('Organization')
export class OrganizationMemberHTTPController {
  constructor(
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient
  ) {}

  @Get()
  @ApiQuery({
    name: 'workspaceID',
    type: 'string',
  })
  @Authorize.Permissions<Request<any, any, { workspaceID: string }>>([Permission.ORGANIZATION_READ], ({ query }) => ({
    id: query.workspaceID as string,
    kind: 'workspace',
  }))
  @ZodApiResponse({ status: HttpStatus.OK, schema: OrganizationMemberDTO.array() })
  async getOrganizationMembers(@Param('organizationID') organizationID: string) {
    return this.identityClient.private.getAllOrganizationMembers(organizationID);
  }
}
