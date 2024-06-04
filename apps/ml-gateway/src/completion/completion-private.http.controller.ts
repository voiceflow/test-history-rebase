import { Body, Controller, HttpStatus, Inject, MessageEvent, Post } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { BillingAuthorize, BillingTrackUsageResource, BillingTrackUsageValue } from '@voiceflow/sdk-billing/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { from, map, mergeMap, Observable } from 'rxjs';

import { CompletionOutput } from '@/llm/llm-model.dto';

import { CompletionService } from './completion.service';
import { ChatCompletionRequest } from './dtos/chat-completion.request';
import { CompletionRequest } from './dtos/completion.request';
import { CompletionResponse } from './dtos/completion.response';
import { PostSSE } from './utils/sse.decorator';

@Controller('private/completion')
@ApiTags('Private/Completion')
@BillingAuthorize({
  resourceType: 'workspace',
  resourceID: (context) => context.switchToHttp().getRequest().body.workspaceID,
  item: 'addon-tokens',
  value: 0,
})
@BillingTrackUsageResource({
  resourceType: 'workspace',
  resourceID: (context) => context.switchToHttp().getRequest().body.workspaceID,
  item: 'addon-tokens',
})
export class CompletionPrivateHTTPController {
  constructor(
    @Inject(CompletionService)
    private readonly service: CompletionService,
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
  @BillingTrackUsageValue((resp: CompletionResponse) => resp.tokens)
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
  @BillingTrackUsageValue((resp: CompletionResponse) => resp.tokens)
  async generateChatCompletion(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Promise<CompletionResponse> {
    return this.service.generateChatCompletion(request);
  }

  @PostSSE('stream')
  @ApiOperation({
    summary: 'Generate prompt completion',
    description: 'Generate prompt completion with a given model',
  })
  @ApiProduces('text/event-stream')
  @ZodApiBody({ schema: CompletionRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: CompletionResponse,
    description: 'AI response',
  })
  @BillingTrackUsageValue((resp: MessageEvent) => (resp.data as CompletionOutput).tokens)
  generateCompletionStream(
    @Body(new ZodValidationPipe(CompletionRequest))
    request: CompletionRequest
  ): Observable<MessageEvent> {
    return from(this.service.generateCompletionStream(request)).pipe(
      mergeMap((response) => response),
      map((chunk) => {
        return {
          type: chunk.type,
          data: chunk.completion,
        };
      })
    );
  }

  @PostSSE('chat/stream')
  @ApiOperation({
    summary: 'Generate chat completion',
    description: 'Generate chat completion with a given model',
  })
  @ApiProduces('text/event-stream')
  @ZodApiBody({ schema: ChatCompletionRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: CompletionResponse,
    description: 'AI response',
  })
  @BillingTrackUsageValue((resp: MessageEvent) => (resp.data as CompletionOutput).tokens)
  generateChatCompletionStream(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Observable<MessageEvent> {
    return from(this.service.generateChatCompletionStream(request)).pipe(
      mergeMap((response) => response),
      map((chunk) => {
        return {
          type: chunk.type,
          data: chunk.completion,
        };
      })
    );
  }
}
