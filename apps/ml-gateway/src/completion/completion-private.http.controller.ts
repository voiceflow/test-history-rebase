import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { CompletionService } from './completion.service';
import { ChatCompletionRequest } from './dtos/chat-completion.request';
import { CompletionRequest } from './dtos/completion.request';
import { CompletionResponse } from './dtos/completion.response';

@Controller('private/completion')
@ApiTags('Private/Completion')
export class CompletionPrivateHTTPController {
  constructor(
    @Inject(CompletionService)
    private readonly service: CompletionService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Generate prompt completion',
    description: 'Generate prompt completion with a given model',
  })
  @ZodApiBody({ schema: CompletionRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: CompletionResponse,
    description: 'AI response',
  })
  async generateCompletion(
    @Body(new ZodValidationPipe(CompletionRequest))
    request: CompletionRequest
  ): Promise<CompletionResponse> {
    return this.service.generateCompletion(request);
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Generate chat completion',
    description: 'Generate chat completion with a given model',
  })
  @ZodApiBody({ schema: ChatCompletionRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: CompletionResponse,
    description: 'AI response',
  })
  async generateChatCompletion(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Promise<CompletionResponse> {
    return this.service.generateChatCompletion(request);
  }
}
