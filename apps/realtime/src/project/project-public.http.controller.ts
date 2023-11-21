import { Body, Controller, HttpStatus, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HashedWorkspaceID, ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { AssistantService } from '@/assistant/assistant.service';
import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common/pipes/hashed-workspace-id-payload.pipe';

import { ProjectImportJSONRequest } from './dtos/project-import-json.request';
import { ProjectImportJSONResponse } from './dtos/project-import-json.response';
import { ProjectImportJSONData } from './dtos/project-import-json-data.dto';
import { ProjectSerializer } from './project.serializer';

@Controller('project')
@ApiTags('Project')
export class ProjectPublicHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly assistantService: AssistantService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  /**
   * @deprecated Use /assistant/import-file/:workspaceID instead
   */
  @Post('import-file/:workspaceID')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
  @ApiOperation({ deprecated: true, summary: 'Deprecated. Use /assistant/import-file/:workspaceID instead' })
  @ApiBody({
    schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, clientID: { type: 'string' } } },
  })
  @ApiParam({ name: 'workspaceID', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: ProjectImportJSONResponse })
  @UseInterceptors(FileInterceptor('file'))
  importFile(
    @UserID() userID: number,
    @HashedWorkspaceID('workspaceID') workspaceID: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() { clientID }: { clientID?: string }
  ): Promise<ProjectImportJSONResponse> {
    const data = ProjectImportJSONData.parse(JSON.parse(file.buffer.toString('utf8')));

    return this.assistantService
      .importJSONAndBroadcast({ data, clientID, userID, workspaceID })
      .then(({ project }) => this.projectSerializer.nullable(project));
  }

  /**
   * @deprecated Use /assistant/import-json instead
   */
  @Post('import-json')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE], (request: Request<unknown, unknown, ProjectImportJSONRequest>) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({ deprecated: true, summary: 'Deprecated. Use /assistant/import-json instead' })
  @ZodApiBody({ schema: ProjectImportJSONRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: ProjectImportJSONResponse })
  importJSON(
    @UserID() userID: number,
    @Body(new ZodValidationPipe(ProjectImportJSONRequest), HashedWorkspaceIDPayloadPipe)
    { data, workspaceID }: HashedWorkspaceIDPayloadType<ProjectImportJSONRequest>
  ): Promise<ProjectImportJSONResponse> {
    return this.assistantService
      .importJSONAndBroadcast({ data, userID, workspaceID })
      .then(({ project }) => this.projectSerializer.nullable(project));
  }
}
