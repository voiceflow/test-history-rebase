import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { z } from 'zod';

// import { KnowledgeBaseSettingsService } from './settings.service';

@Controller('knowledge-base')
@ApiTags('KnowledgeBaseSettings')
export class KnowledgeBaseSettingsPublicHTTPController {
  /* constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {} */

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get knowledge base settings',
  })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get general knowledge base settings',
    schema: z.object({}),
  })
  async getSettings(): Promise<object> {
    // console.log('hello world');
    return {};
    // const settings = await this.service.findOne();
    // TODO: implement..
  }
}
