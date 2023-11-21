import { Body, Controller, Get, Headers, HttpStatus, Inject, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { HashedWorkspaceID, ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common/pipes/hashed-workspace-id-payload.pipe';
import { ProjectSerializer } from '@/project/project.serializer';
import { VersionIDAlias } from '@/version/version.constant';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantExportJSONResponse } from './dtos/assistant-export-json.response';
import { AssistantExportJSONQuery } from './dtos/assistant-export-json-query.dto';
import { AssistantImportJSONRequest } from './dtos/assistant-import-json.request';
import { AssistantImportJSONResponse } from './dtos/assistant-import-json.response';
import { AssistantImportJSONData } from './dtos/assistant-import-json-data.dto';

@Controller('assistant')
@ApiTags('Assistant')
export class AssistantPublicHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(AssistantSerializer)
    private readonly serializer: AssistantSerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  @Get('export-json/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'workspace',
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
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantExportJSONResponse })
  exportJSON(
    @Param('environmentID') environmentID: string,
    @Headers('assistantID') assistantID: string | undefined,
    @Query(new ZodValidationPipe(AssistantExportJSONQuery)) query: AssistantExportJSONQuery
  ): Promise<AssistantExportJSONResponse> {
    return this.service.exportJSON({ ...query, environmentID, assistantID });
  }

  @Post('import-file/:workspaceID')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
  @ApiBody({
    schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, clientID: { type: 'string' } } },
  })
  @ApiParam({ name: 'workspaceID', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantImportJSONResponse })
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @UserID() userID: number,
    @HashedWorkspaceID('workspaceID') workspaceID: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() { clientID }: { clientID?: string }
  ): Promise<AssistantImportJSONResponse> {
    const data = AssistantImportJSONData.parse(JSON.parse(file.buffer.toString('utf8')));

    const { project, assistant } = await this.service.importJSONAndBroadcast({ data, userID, clientID, workspaceID });

    return {
      project: this.projectSerializer.nullable(project),
      assistant: this.serializer.nullable(assistant),
    };
  }

  @Post('import-json')
  @Authorize.Permissions<Request<unknown, unknown, AssistantImportJSONRequest>>([Permission.WORKSPACE_PROJECT_CREATE], (request) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ZodApiBody({ schema: AssistantImportJSONRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantImportJSONResponse })
  async importJSON(
    @UserID() userID: number,
    @Body(new ZodValidationPipe(AssistantImportJSONRequest), HashedWorkspaceIDPayloadPipe)
    { data, workspaceID }: HashedWorkspaceIDPayloadType<AssistantImportJSONRequest>
  ): Promise<AssistantImportJSONResponse> {
    const { project, assistant } = await this.service.importJSONAndBroadcast({ data, userID, workspaceID });

    return {
      project: this.projectSerializer.nullable(project),
      assistant: this.serializer.nullable(assistant),
    };
  }
}
