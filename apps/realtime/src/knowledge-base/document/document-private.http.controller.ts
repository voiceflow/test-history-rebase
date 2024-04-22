import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { KnowledgeBaseDocumentService } from './document.service';
import { DocumentDeleteRequest, DocumentDeleteResponse } from './dtos/document-delete.dto';

@Controller('private/knowledge-base-document')
@ApiTags('Private/knowledge-base-document')
export class KnowledgeBaseDocumentPrivateHTTPController {
  constructor(
    @Inject(KnowledgeBaseDocumentService)
    private readonly documentService: KnowledgeBaseDocumentService
  ) {}

  @Delete(':assistantID/knowledge-base/documents/:documentID')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete document',
    description: 'Delete one documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete document by id in the target project',
  })
  async deleteOne(@Param('assistantID') assistantID: string, @Param('documentID') documentID: string): Promise<void> {
    // TDOD: remove from refresh queue
    await this.documentService.deleteManyDocuments([documentID], assistantID);
  }

  @Post(':assistantID/knowledge-base/documents/delete-many')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete documents',
    description: 'Delete many documents by ids',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: DocumentDeleteRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: DocumentDeleteResponse,
    description: 'Delete many documents by ids in the target project',
  })
  async deleteMany(
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(DocumentDeleteRequest)) { documentIDs }: DocumentDeleteRequest
  ): Promise<DocumentDeleteResponse> {
    await this.documentService.deleteManyDocuments(documentIDs, assistantID);
    // TDOD: remove from refresh queue
    return { deletedDocumentIDs: documentIDs };
  }
}
