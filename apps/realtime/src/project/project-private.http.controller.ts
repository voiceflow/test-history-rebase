import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common';

import { CreateProjectFixtureRequest } from './dtos/create-project-fixture.request';
import { ProjectImportJSONResponse } from './dtos/project-import-json.response';
import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';

@Controller('private/project')
@ApiTags('Private/Project')
export class ProjectPrivateHTTPController {
  constructor(
    @Inject(ProjectService)
    private readonly service: ProjectService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Project Fixture',
    description: 'Create a new project from a JSON import',
  })
  @ZodApiBody({ schema: CreateProjectFixtureRequest })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: ProjectImportJSONResponse,
    description: 'Project created in the target workspace',
  })
  async createFixture(
    @Body(new ZodValidationPipe(CreateProjectFixtureRequest), HashedWorkspaceIDPayloadPipe)
    { userID, workspaceID, data }: HashedWorkspaceIDPayloadType<CreateProjectFixtureRequest>
  ): Promise<ProjectImportJSONResponse> {
    return this.service.importJSON({ userID, workspaceID, data }).then(({ project }) => this.projectSerializer.nullable(project));
  }
}
