import { Inject, Injectable } from '@nestjs/common';

import { ResponseRepository } from './response.repository';
import { ResponseImportService } from './response-import.service';

@Injectable()
export class ResponseCloneService {
  constructor(
    @Inject(ResponseImportService)
    private readonly importService: ResponseImportService,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository
  ) {}

  async cloneManyWithSubResourcesForEnvironment({
    targetAssistantID,
    sourceEnvironmentID,
    targetEnvironmentID,
  }: {
    targetAssistantID: string;
    sourceEnvironmentID: string;
    targetEnvironmentID: string;
  }) {
    const {
      responses: sourceResponses,
      responseVariants: sourceResponseVariants,
      responseAttachments: sourceResponseAttachments,
      responseDiscriminators: sourceResponseDiscriminators,
    } = await this.repository.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importService.importManyWithSubResources({
      responses: sourceResponses.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      responseVariants: sourceResponseVariants.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      responseAttachments: sourceResponseAttachments.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      responseDiscriminators: sourceResponseDiscriminators.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }
}
