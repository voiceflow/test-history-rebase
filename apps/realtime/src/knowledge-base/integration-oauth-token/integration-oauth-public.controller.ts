import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';

import { IntegrationFindManyResponse } from './dtos/integration-find.dto';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';

@Controller('knowledge-base/:assistantID/integrations')
@ApiTags('KnowledgeBaseIntegrations')
export class KnowledgeBaseIntegrationsPublicHTTPController {
  constructor(
    @Inject(IntegrationOauthTokenService)
    private readonly service: IntegrationOauthTokenService
  ) {}

  @Get()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get knowledge base integrations' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: IntegrationFindManyResponse,
    description: 'Get the knowledge base integrations',
  })
  async getIntegrations(@Param('assistantID') assistantID: string): Promise<IntegrationFindManyResponse> {
    return this.service.getManyIntegrationTokens(assistantID);
  }

  @Delete(':integrationType')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete knowledge base integration' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a knowledge base integration',
  })
  async deleteIntegration(@Param('assistantID') assistantID: string, @Param('integrationType') integrationType: string): Promise<void> {
    return this.service.deleteIntegration(assistantID, integrationType);
  }
}
