import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseSettingsService } from './settings.service';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { z } from 'zod';
import type { Request } from 'express';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

@Controller('knowledge-base-settings')
@ApiTags('KnowledgeBaseSettings')
export class KnowledgeBaseSettingsPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    private readonly service: KnowledgeBaseSettingsService
  ) {}

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

  @Get('public/:documentID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get document',
    description: 'Get one documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get document by id in the target project',
    schema: z.object({ hello: z.string() }),
  })
  async publicGetOne(@Param('assistantID') assistantID: string, @Param('documentID') documentID: string): Promise<{ hello: string }> {
    return { hello: 'world' };
  }
}
