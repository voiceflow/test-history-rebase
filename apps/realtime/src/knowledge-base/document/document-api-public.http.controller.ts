import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnsupportedMediaTypeException } from '@voiceflow/exception';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Identity } from '@voiceflow/sdk-auth';
import { Authorize, Principal } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';

import { MulterFile } from '@/file/types';

import { KnowledgeBaseDocumentService } from './document.service';
import { DocumentCreateOneURLRequest, DocumentCreateResponse } from './dtos/document-create.dto';

@Controller('public/knowledge-base/document')
@ApiTags('KBPublicApiDocument')
@Authorize.Identity()
export class KnowledgeBaseDocumentApiPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseDocumentService)
    private readonly service: KnowledgeBaseDocumentService
  ) {}

  /* Create */

  @Post('upload')
  @ApiConsumes('knowledgeBase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create kb document public api',
    description: 'Create kb document public api by provided info',
  })
  @ApiHeader({
    name: 'content-type',
    schema: { type: 'string', description: 'The Content-Type header is used to indicate the media type of the resource' },
  })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Create kb document public api by provided info',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB limit
      },
    })
  )
  @ZodApiBody({ schema: DocumentCreateOneURLRequest })
  async publicCreateOne(
    @Req() request: Request,
    @Principal() principal: Identity & { userID?: number; createdBy?: number },
    @UploadedFile() file?: MulterFile,
    @Body() body?: DocumentCreateOneURLRequest
  ): Promise<DocumentCreateResponse> {
    const data = principal as { createdBy: number; legacy: { projectID: string } };

    const assistantID = data.legacy?.projectID;
    const creatorID = data.createdBy;

    if (request.is('multipart/form-data') && file) {
      return this.service.uploadFileDocument(assistantID, creatorID, file);
    }

    if (request.is('application/json') && body) {
      const response = await this.service.createManyDocuments(assistantID, creatorID, { data: [body.data] });
      return response[0];
    }

    throw new UnsupportedMediaTypeException('invalid content type');
  }
}
