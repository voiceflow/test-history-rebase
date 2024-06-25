import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseSettings, KnowledgeBaseSettingsDTO } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { KnowledgeBaseSettingsService } from './settings.service';

@Controller('versions/:environmentID/knowledge-base/settings')
@ApiTags('VersionKnowledgeBaseSettings')
export class KnowledgeBaseVersionSettingsPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {}

  @Get()
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get version knowledge base settings' })
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: KnowledgeBaseSettingsDTO,
    description: 'Get the users versioned knowledge base settings',
  })
  async getOne(@Param('environmentID') environmentID: string): Promise<KnowledgeBaseSettings> {
    return this.service.findForEnvironment(environmentID);
  }

  @Patch()
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update version knowledge base settings' })
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiBody({ schema: KnowledgeBaseSettingsDTO })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Update the users versioned knowledge base settings',
  })
  async updateOne(
    @Param('environmentID') environmentID: string,
    @Body(new ZodValidationPipe(KnowledgeBaseSettingsDTO)) newSettings: KnowledgeBaseSettings
  ): Promise<void> {
    return this.service.updateForEnvironment(environmentID, newSettings);
  }
}
