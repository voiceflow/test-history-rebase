import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import type { Request } from 'express';

import { KnowledgeBaseDocumentService } from './document.service';

@Injectable()
export class VfChunksVariableBetaAccessInterceptor implements NestInterceptor {
  constructor(
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(KnowledgeBaseDocumentService)
    private readonly document: KnowledgeBaseDocumentService
  ) {}

  FF_VF_CHUNKS_VARIABLE = 'vf_chunks_variable';

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const projectID = await this.document.resolveAssistantID(request);
    const teamID = await this.document.resolveWorkspaceID(projectID);

    if (!this.unleash.isEnabled(this.FF_VF_CHUNKS_VARIABLE, { workspaceID: teamID })) {
      throw new ForbiddenException(
        'This endpoint is only accessible to users within the restricted group. If you believe you should have access, please contact support for further assistance.'
      );
    }

    return next.handle();
  }
}
