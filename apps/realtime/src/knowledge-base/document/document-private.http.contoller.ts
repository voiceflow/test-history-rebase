import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { KnowledgeBaseDocumentService } from './document.service';
import { DocumentPatchOneRequest } from './dtos/document-patch.dto';

@Controller('private/knowledge-base/:assistantID/document')
@ApiTags('KBPrivateDocument')
export class KnowledgeBaseDocumentPrivateHTTPController {
  constructor(
    @Inject(KnowledgeBaseDocumentService)
    private readonly service: KnowledgeBaseDocumentService
  ) {}

  /* Patch */

  @Patch(':documentID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update one document',
    description: 'Private endpoint for update one document metadata',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiBody({ schema: DocumentPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Private endpoint for update one document metadata',
  })
  async patchOne(
    @Param('assistantID') assistantID: string,
    @Param('documentID') documentID: string,
    @Body(new ZodValidationPipe(DocumentPatchOneRequest)) document: DocumentPatchOneRequest
  ): Promise<void> {
    await this.service.patchOneDocument(assistantID, documentID, document);
  }
}
