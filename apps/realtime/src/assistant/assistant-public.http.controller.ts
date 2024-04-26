import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { HashedWorkspaceID, ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Identity, Permission } from '@voiceflow/sdk-auth';
import { Authorize, Principal, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { appRef } from '@/app.ref';
import {
  HashedWorkspaceIDPayloadPipe,
  HashedWorkspaceIDPayloadType,
} from '@/common/pipes/hashed-workspace-id-payload.pipe';
import { EnvironmentService } from '@/environment/environment.service';
import { ProjectSerializer } from '@/project/project.serializer';
import { VersionIDAlias } from '@/version/version.constant';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantExportCMSResponse } from './dtos/assistant-export-cms.response';
import { AssistantExportDataDTO } from './dtos/assistant-export-data.dto';
import { AssistantExportJSONQuery } from './dtos/assistant-export-json.query';
import { AssistantFindEnvironmentsResponse } from './dtos/assistant-find-environments.response';
import { AssistantImportJSONRequest } from './dtos/assistant-import-json.request';
import { AssistantImportJSONResponse } from './dtos/assistant-import-json.response';
import { ResolveEnvironmentIDAliasInterceptor } from './resolve-environment-id-alias.interceptor';

@Controller('assistant')
@ApiTags('Assistant')
export class AssistantPublicHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(AssistantSerializer)
    private readonly serializer: AssistantSerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService
  ) {}

  @Get(':assistantID/environments')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @ZodApiResponse({ status: HttpStatus.OK, schema: AssistantFindEnvironmentsResponse })
  async findEnvironments(@Param('assistantID') assistantID: string): Promise<AssistantFindEnvironmentsResponse> {
    return this.environment.findManyForAssistantID(assistantID);
  }

  @Get('export-cms/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(AssistantService).resolveEnvironmentIDAlias(request),
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
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantExportCMSResponse })
  @UseInterceptors(ResolveEnvironmentIDAliasInterceptor)
  exportCMS(
    @UserID() userID: number,
    @Param('environmentID') environmentID: string
  ): Promise<AssistantExportCMSResponse> {
    return this.service.exportCMS({ userID, environmentID });
  }

  @Get('export-json/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(AssistantService).resolveEnvironmentIDAlias(request),
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
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: AssistantExportDataDTO })
  @UseInterceptors(ResolveEnvironmentIDAliasInterceptor)
  exportJSON(
    @Principal() principal: Identity & { userID?: number; createdBy?: number },
    @Param('environmentID') environmentID: string,
    @Query(new ZodValidationPipe(AssistantExportJSONQuery)) query: AssistantExportJSONQuery
  ): Promise<AssistantExportDataDTO> {
    const userID = principal.userID ?? principal.createdBy ?? principal.id;
    return this.service.exportJSON({
      ...query,
      userID,
      environmentID,
      prototypePrograms: query.prototypePrograms || query.prototype,
    });
  }

  @Post('import-file/:workspaceID')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' }, clientID: { type: 'string' } },
    },
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
    const data = this.service.parseImportData(file.buffer.toString('utf8'));

    const { project, assistant } = await this.service.importJSONAndBroadcast({ data, userID, clientID, workspaceID });

    return {
      project: this.projectSerializer.nullable(project),
      assistant: this.serializer.nullable(assistant),
      sourceProjectID: data.project._id,
    };
  }

  @Post('import-json')
  @Authorize.Permissions<Request<unknown, unknown, AssistantImportJSONRequest>>(
    [Permission.WORKSPACE_PROJECT_CREATE],
    (request) => ({
      id: request.body.workspaceID,
      kind: 'workspace',
    })
  )
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
      sourceProjectID: data.project._id,
    };
  }
}
