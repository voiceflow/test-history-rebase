import { Controller, Get, HttpCode, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { KnowledgeBaseSettingsService } from '@/knowledge-base/settings/settings.service';

@Controller('private/knowledge-base/:assistantID/settings')
@ApiTags('KBPrivateSettings')
export class KnowledgeBaseSettingsPrivateHTTPController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {}

  /* Get */

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get assistant kb settings',
    description: 'Private endpoint for retrieve assistant kb settings',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Private endpoint for retrieve assistant kb settings',
  })
  async getOne(@Param('assistantID') assistantID: string): Promise<KnowledgeBaseSettings> {
    return this.service.getProjectSettings(assistantID);
  }
}
