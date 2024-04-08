import { Body, Controller, HttpStatus, Inject, Post, Sse, UseGuards, UseInterceptors, MessageEvent } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { BillingAuthorizeGuard, Authorize, BillingTrackUsageInterceptor, BillingTrackUsageService } from '@voiceflow/sdk-billing/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { CompletionService } from './completion.service';
import { ChatCompletionRequest } from './dtos/chat-completion.request';
import { CompletionRequest } from './dtos/completion.request';
import { CompletionResponse } from './dtos/completion.response';
import { createFrom } from './utils/async-iterator-to-observable';

@Controller('private/completion')
@ApiTags('Private/Completion')
@UseGuards(BillingAuthorizeGuard)
@UseInterceptors(BillingTrackUsageInterceptor)
@Authorize({
  resourceType: 'workspace',
  resourceID: (context) => context.switchToHttp().getRequest().body.workspaceID,
  item: 'addon-tokens',
  value: 0,
})
export class CompletionPrivateHTTPController {
  constructor(
    @Inject(CompletionService)
    private readonly service: CompletionService,
    private readonly trackUsage: BillingTrackUsageService
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
    const result = await this.service.generateCompletion(request);

    this.trackUsage.track({
      resourceType: 'workspace',
      resourceID: String(request.workspaceID),
      item: 'addon-tokens',
      value: result.tokens,
    });

    return result;
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
  async generateChatCompletionStream(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Promise<CompletionResponse> {
    const result = await this.service.generateChatCompletion(request);

    this.trackUsage.track({
      resourceType: 'workspace',
      resourceID: String(request.workspaceID),
      item: 'addon-tokens',
      value: result.tokens,
    });

    return result;
  }

  @Sse('stream')
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
  generateCompletionStream(
    @Body(new ZodValidationPipe(CompletionRequest))
    request: CompletionRequest
  ): Observable<MessageEvent> {
    return createFrom(() => this.service.generateCompletionStream(request)).pipe(
      tap((chunk) => this.trackUsage.track({
        resourceType: 'workspace',
        resourceID: String(request.workspaceID),
        item: 'addon-tokens',
        value: chunk.tokens,
      })),
      map((chunk) => {
        if (chunk.error) {
          return {
            type: 'error',
            data: { error: chunk.error },
          }
        }

        return {
          type: 'completion',
          data: chunk,
        }
      })
    );
  }

  @Sse('chat/stream')
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
  generateChatCompletion(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Observable<MessageEvent> {
    return createFrom(() => this.service.generateChatCompletionStream(request)).pipe(
      tap((chunk) => this.trackUsage.track({
        resourceType: 'workspace',
        resourceID: String(request.workspaceID),
        item: 'addon-tokens',
        value: chunk.tokens,
      })),
      map((chunk) => {
        if (chunk.error) {
          return {
            type: 'error',
            data: { error: chunk.error },
          }
        }

        return {
          type: 'completion',
          data: chunk,
        }
      })
    );
  }
}
