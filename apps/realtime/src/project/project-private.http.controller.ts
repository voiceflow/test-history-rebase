import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { AssistantService } from '@/assistant/assistant.service';
import { HashedWorkspaceIDPayloadPipe, type HashedWorkspaceIDPayloadType } from '@/common';

import { ProjectCreateFixtureRequest } from './dtos/project-create-fixture.request';
import { ProjectImportJSONResponse } from './dtos/project-import-json.response';
import { ProjectSerializer } from './project.serializer';

@Controller('private/project')
@ApiTags('Private/Project')
export class ProjectPrivateHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly assistantService: AssistantService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  /**
   * @deprecated Use /assistant/import-file/:workspaceID instead
   */
  @Post()
  @ApiOperation({
    summary: 'Deprecated. Use /private/assistant instead',
    deprecated: true,
    description: 'Create a new project from a JSON import',
  })
  @ZodApiBody({ schema: ProjectCreateFixtureRequest })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: ProjectImportJSONResponse,
    description: 'Project created in the target workspace',
  })
  async createFixture(
    @Body(new ZodValidationPipe(ProjectCreateFixtureRequest), HashedWorkspaceIDPayloadPipe)
    { userID, workspaceID, data }: HashedWorkspaceIDPayloadType<ProjectCreateFixtureRequest>
  ): Promise<ProjectImportJSONResponse> {
    return this.assistantService
      .importJSONAndBroadcast({ userID, workspaceID, data })
      .then(({ project }) => this.projectSerializer.nullable(project));
  }
}
