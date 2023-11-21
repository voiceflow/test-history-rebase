import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { HashedWorkspaceIDPayloadPipe, HashedWorkspaceIDPayloadType } from '@/common';
import { ProjectSerializer } from '@/project/project.serializer';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantCreateFixtureRequest } from './dtos/assistant-create-fixture.request';
import { AssistantImportJSONResponse } from './dtos/assistant-import-json.response';

@Controller('private/assistant')
@ApiTags('Private/Assistant')
export class AssistantPrivateHTTPController {
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(AssistantSerializer)
    private readonly serializer: AssistantSerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
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
}
