import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseSettings, KnowledgeBaseSettingsDTO } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { KnowledgeBaseSettingsService } from './settings.service';

@Controller('knowledge-base/:assistantID/settings')
@ApiTags('KnowledgeBaseSettings')
export class KnowledgeBaseSettingsPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {}

  @Get()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get knowledge base settings' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: KnowledgeBaseSettingsDTO,
    description: 'Get the users knowledge base settings',
  })
  async getSettings(@Param('assistantID') assistantID: string): Promise<KnowledgeBaseSettings> {
    return this.service.getSettings(assistantID);
  }

  @Patch()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update knowledge base settings ' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: KnowledgeBaseSettingsDTO })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Update the users knowledge base settings for the assistant',
  })
  async updateSettings(
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(KnowledgeBaseSettingsDTO)) newSettings: KnowledgeBaseSettings
  ): Promise<void> {
    return this.service.updateSettings(assistantID, newSettings);
  }
}
