import { Body, Controller, Get, Headers, HttpStatus, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Identity, Permission } from '@voiceflow/sdk-auth';
import { Authorize, Principal } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common';
import { ProjectSerializer } from '@/project/project.serializer';
import { VersionIDAlias } from '@/version/version.constant';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantPublishService } from './assistant-publish.service';
import { AssistantCreateFixtureRequest } from './dtos/assistant-create-fixture.request';
import { AssistantExportImportDataDTO } from './dtos/assistant-export-import-data.dto';
import { AssistantExportJSONQuery } from './dtos/assistant-export-json.query';
import { AssistantImportJSONResponse } from './dtos/assistant-import-json.response';
import { AssistantPublishResponse } from './dtos/assistant-publish.response';

@Controller('private/assistant')
@ApiTags('Private/Assistant')
export class AssistantPrivateHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(AssistantSerializer)
    private readonly serializer: AssistantSerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(AssistantPublishService)
    private readonly assistantPublish: AssistantPublishService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Assistant Fixture',
    description: 'Create a new project from a JSON import',
  })
  @ZodApiBody({ schema: AssistantCreateFixtureRequest })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: AssistantImportJSONResponse,
    description: 'Assistant created in the target workspace',
  })
  async createFixture(
    @Body(new ZodValidationPipe(AssistantCreateFixtureRequest), HashedWorkspaceIDPayloadPipe)
    { userID, workspaceID, data }: HashedWorkspaceIDPayloadType<AssistantCreateFixtureRequest>
  ): Promise<AssistantImportJSONResponse> {
    const { project, assistant } = await this.service.importJSONAndBroadcast({ data, userID, workspaceID });

    return {
      project: this.projectSerializer.nullable(project),
      assistant: this.serializer.nullable(assistant),
    };
  }

  @Post(':assistantID/publish')
  @ApiOperation({
    summary: 'Publish Assistant to production',
    description: 'Publish Assistant to production',
  })
  @ApiQuery({ name: 'name', required: false })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: AssistantPublishResponse,
    description: 'Assistant created in the target workspace',
  })
  async publish(
    @Param('assistantID') assistantID: string,
    @Query('userID', ParseIntPipe) userID: number,
    @Query('name') name?: string
  ): Promise<AssistantPublishResponse> {
    const project = await this.assistantPublish.publish(assistantID, userID, name);

    return {
      project: this.projectSerializer.serialize(project),
    };
  }

  @Get('export-json/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @ApiParam({
    name: 'environmentID',
    type: 'string',
    description: `Accepts environmentID or environment id alias (${Object.values(VersionIDAlias).join(', ')})`,
  })
  @ApiHeader({
    name: 'assistantID',
    schema: { type: 'string', description: 'Required if environment id alias is used' },
  })
  @ZodApiQuery({ schema: AssistantExportJSONQuery })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantExportImportDataDTO })
  exportJSON(
    @Principal() principal: Identity & { createdBy: number },
    @Param('environmentID') environmentID: string,
    @Headers('assistantID') assistantID: string | undefined,
    @Query(AssistantExportJSONQuery) query: AssistantExportJSONQuery
  ): Promise<AssistantExportImportDataDTO> {
    return this.service.exportJSON({ ...query, userID: principal.createdBy, assistantID, environmentID });
  }
}
