import { Body, Controller, HttpStatus, Inject, Logger, MessageEvent, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { BillingClient, BillingResourceType, TrackUsageItemName } from '@voiceflow/sdk-billing';
import { BillingAuthorize, BillingAuthorizeGuard } from '@voiceflow/sdk-billing/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { finalize, from, map, mergeMap, Observable, tap } from 'rxjs';

import { CompletionService } from './completion.service';
import { ChatCompletionRequest } from './dtos/chat-completion.request';
import { CompletionRequest } from './dtos/completion.request';
import { CompletionResponse } from './dtos/completion.response';
import { PostSSE } from './utils/sse.decorator';

@Controller('private/completion')
@ApiTags('Private/Completion')
@UseGuards(BillingAuthorizeGuard)
@BillingAuthorize({
  resourceType: 'workspace',
  resourceID: (context) => context.switchToHttp().getRequest().body.workspaceID,
  item: 'addon-tokens',
  value: 0,
})
export class CompletionPrivateHTTPController {
  private logger = new Logger(CompletionPrivateHTTPController.name);

  constructor(
    @Inject(CompletionService)
    private readonly service: CompletionService,
    @Inject(BillingClient)
    private readonly billing: BillingClient
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

    await this.billing.usagesPrivate.trackUsage({
      resourceType: BillingResourceType.WORKSPACE,
      resourceID: String(request.workspaceID),
      item: TrackUsageItemName.Tokens,
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
  async generateChatCompletion(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Promise<CompletionResponse> {
    const result = await this.service.generateChatCompletion(request);

    await this.billing.usagesPrivate.trackUsage({
      resourceType: BillingResourceType.WORKSPACE,
      resourceID: String(request.workspaceID),
      item: TrackUsageItemName.Tokens,
      value: result.tokens,
    });

    return result;
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
  generateCompletionStream(
    @Body(new ZodValidationPipe(CompletionRequest))
    request: CompletionRequest
  ): Observable<MessageEvent> {
    let tokens = 0;
    return from(this.service.generateCompletionStream(request)).pipe(
      mergeMap((response) => response),
      tap((chunk) => {
        tokens += chunk.completion.tokens;
      }),
      map((chunk) => {
        return {
          type: chunk.type,
          data: chunk.completion,
        };
      }),
      finalize(() => this.billing.usagesPrivate
        .trackUsage({
          resourceType: BillingResourceType.WORKSPACE,
          resourceID: String(request.workspaceID),
          item: TrackUsageItemName.Tokens,
          value: tokens,
        })
        .catch((err) => {
          this.logger.error('Error tracking usage for workspace: %s (%s) %o', request.workspaceID, tokens, err);
        })
      )
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
  generateChatCompletionStream(
    @Body(new ZodValidationPipe(ChatCompletionRequest))
    request: ChatCompletionRequest
  ): Observable<MessageEvent> {
    let tokens = 0;
    return from(this.service.generateChatCompletionStream(request)).pipe(
      mergeMap((response) => response),
      tap((chunk) => {
        tokens += chunk.completion.tokens;
      }),
      map((chunk) => {
        return {
          type: chunk.type,
          data: chunk.completion,
        };
      }),
      finalize(() => this.billing.usagesPrivate
        .trackUsage({
          resourceType: BillingResourceType.WORKSPACE,
          resourceID: String(request.workspaceID),
          item: TrackUsageItemName.Tokens,
          value: tokens,
        })
        .catch((err) => {
          this.logger.error('Error tracking token usage for workspace: %s (%s) %o', request.workspaceID, tokens, err);
        })
      )
    );
  }
}
