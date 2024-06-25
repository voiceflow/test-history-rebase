import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { AssistantService } from './assistant.service';

@Injectable()
export class ResolveEnvironmentIDAliasInterceptor implements NestInterceptor {
  constructor(@Inject(AssistantService) private readonly assistant: AssistantService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();

    request.params.environmentID = await this.assistant.resolveEnvironmentIDAlias(request);

    return next.handle();
  }
}
