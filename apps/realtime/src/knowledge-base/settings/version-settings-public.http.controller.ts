import { Controller, Get, HttpCode, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseSettings, KnowledgeBaseSettingsDTO } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';

import { KnowledgeBaseSettingsService } from './settings.service';

@Controller('versions/:versionID/knowledge-base/settings')
@ApiTags('VersionKnowledgeBaseSettings')
export class KnowledgeBaseVersionSettingsPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {}

  @Get()
  @Authorize.Permissions<Request<{ versionID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.versionID,
    kind: 'version',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get version knowledge base settings' })
  @ApiParam({ name: 'versionID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: KnowledgeBaseSettingsDTO,
    description: 'Get the users versioned knowledge base settings',
  })
  async getSettings(@Param('versionID') versionID: string): Promise<KnowledgeBaseSettings> {
    return this.service.getVersionSettings(versionID);
  }
}
