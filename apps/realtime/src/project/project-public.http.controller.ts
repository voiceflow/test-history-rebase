import { Body, Controller, HttpStatus, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { BadRequestException } from '@voiceflow/exception';
import { HashedWorkspaceID, ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';

import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common/pipes/hashed-workspace-id-payload.pipe';

import { ProjectImportJSONRequest } from './dtos/project-import-json.request';
import { ProjectImportJSONResponse } from './dtos/project-import-json.response';
import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('Project')
export class ProjectPublicHTTPController {
  constructor(
    @Inject(ProjectService)
    private readonly service: ProjectService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  @Post('import-file/:workspaceID')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
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
    let data: ProjectImportJSONRequest['data'];

    try {
      data = JSON.parse(file.buffer.toString('utf8'));
    } catch {
      throw new BadRequestException('invalid file format');
    }

    return this.service.importJSONAndBroadcast({ data, clientID, userID, workspaceID }).then(this.projectSerializer.nullable);
  }

  @Post('import-json')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE], (request: { body: ProjectImportJSONRequest }) => ({
    kind: 'workspace',
    id: request.body.workspaceID,
  }))
  @ZodApiBody({ schema: ProjectImportJSONRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: ProjectImportJSONResponse })
  importJSON(
    @UserID() userID: number,
    @Body(new ZodValidationPipe(ProjectImportJSONRequest), HashedWorkspaceIDPayloadPipe)
    { data, workspaceID }: HashedWorkspaceIDPayloadType<ProjectImportJSONRequest>
  ): Promise<ProjectImportJSONResponse> {
    return this.service.importJSONAndBroadcast({ data, userID, workspaceID }).then(this.projectSerializer.nullable);
  }
}
