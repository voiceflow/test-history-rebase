import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { GenerateEntityRepromptRequest } from './dtos/generate-entity-reprompt.request';
import { GenerateEntityRepromptResponse } from './dtos/generate-entity-reprompt.response';
import { GenerateEntityValueRequest } from './dtos/generate-entity-value.request';
import { GenerateEntityValueResponse } from './dtos/generate-entity-value.response';
import { GeneratePromptRequest } from './dtos/generate-prompt.request';
import { GeneratePromptResponse } from './dtos/generate-prompt.response';
import { GenerateUtteranceRequest } from './dtos/generate-utterance.request';
import { GenerateUtteranceResponse } from './dtos/generate-utterance.response';
import { GenerationService } from './generation.service';

@Controller('generation')
@ApiTags('Generation')
export class GenerationPublicHTTPController {
  constructor(
    @Inject(GenerationService)
    private readonly service: GenerationService
  ) {}

  @Post('prompt')
  @Authorize.Permissions<Request<unknown, unknown, GeneratePromptRequest>>([Permission.WORKSPACE_UPDATE], (request) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({
    summary: 'Generate response suggestions',
  })
  @ZodApiBody({ schema: GeneratePromptRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: GeneratePromptResponse,
    description: 'Generated response suggestions',
  })
  async generatePrompt(
    @Body(new ZodValidationPipe(GeneratePromptRequest))
    request: GeneratePromptRequest
  ): Promise<GeneratePromptResponse> {
    const results = await this.service.generatePrompt(request);
    return { results };
  }

  @Post('utterance')
  @Authorize.Permissions<Request<unknown, unknown, GeneratePromptRequest>>([Permission.WORKSPACE_UPDATE], (request) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({
    summary: 'Generate utterance suggestions',
  })
  @ZodApiBody({ schema: GenerateUtteranceRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: GenerateUtteranceResponse,
    description: 'Generated utterance suggestions',
  })
  async generateUtterance(
    @Body(new ZodValidationPipe(GenerateUtteranceRequest))
    request: GenerateUtteranceRequest
  ): Promise<GenerateUtteranceResponse> {
    const result = await this.service.generateUtterance(request);

    return {
      results: result.utterances,
      suggestedIntentName: result.intent_name,
    };
  }

  @Post('entity-values')
  @Authorize.Permissions<Request<unknown, unknown, GeneratePromptRequest>>([Permission.WORKSPACE_UPDATE], (request) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({
    summary: 'Generate entity value suggestions',
  })
  @ZodApiBody({ schema: GenerateEntityValueRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: GenerateEntityValueResponse,
    description: 'Generated entity value suggestions',
  })
  async generateEntityValue(
    @Body(new ZodValidationPipe(GenerateEntityValueRequest))
    request: GenerateEntityValueRequest
  ): Promise<GenerateEntityValueResponse> {
    const results = await this.service.generateEntityValue(request);
    return { results };
  }

  @Post('entity-prompt')
  @Authorize.Permissions<Request<unknown, unknown, GeneratePromptRequest>>([Permission.WORKSPACE_UPDATE], (request) => ({
    id: request.body.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({
    summary: 'Generate entity prompt suggestions',
  })
  @ZodApiBody({ schema: GenerateEntityRepromptRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: GenerateEntityRepromptResponse,
    description: 'Generated entity prompt suggestions',
  })
  async generateEntityReprompt(
    @Body(new ZodValidationPipe(GenerateEntityRepromptRequest))
    request: GenerateEntityRepromptRequest
  ): Promise<GenerateEntityRepromptResponse> {
    const results = await this.service.generateEntityReprompt(request);
    return { results: results.eg };
  }
}
