import { Body, Controller, HttpStatus, Inject, MessageEvent, Post, Sse, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { BillingClient, BillingResourceType, TrackUsageItemName } from '@voiceflow/sdk-billing';
import { BillingAuthorize, BillingAuthorizeGuard } from '@voiceflow/sdk-billing/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CompletionService } from './completion.service';
import { ChatCompletionRequest } from './dtos/chat-completion.request';
import { CompletionRequest } from './dtos/completion.request';
import { CompletionResponse } from './dtos/completion.response';
import { createFrom } from './utils/async-iterator-to-observable';

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
  constructor(
    @Inject(CompletionService)
    private readonly service: CompletionService,
    private billing: BillingClient
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
  async generateChatCompletionStream(
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
      tap((chunk) =>
        this.billing.usagesPrivate.trackUsage({
          resourceType: BillingResourceType.WORKSPACE,
          resourceID: String(request.workspaceID),
          item: TrackUsageItemName.Tokens,
          value: chunk.tokens,
        })
      ),
      map((chunk) => {
        if (chunk.error) {
          return {
            type: 'error',
            data: { error: chunk.error },
          };
        }

        return {
          type: 'completion',
          data: chunk,
        };
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
      tap((chunk) =>
        this.billing.usagesPrivate.trackUsage({
          resourceType: BillingResourceType.WORKSPACE,
          resourceID: String(request.workspaceID),
          item: TrackUsageItemName.Tokens,
          value: chunk.tokens,
        })
      ),
      map((chunk) => {
        if (chunk.error) {
          return {
            type: 'error',
            data: { error: chunk.error },
          };
        }

        return {
          type: 'completion',
          data: chunk,
        };
      })
    );
  }
}
