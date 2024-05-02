import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { MulterFile } from '@/file/types';

import { KnowledgeBaseDocumentService } from './document.service';
import {
  DocumentCreateManyResponse,
  DocumentCreateManyURLsRequest,
  DocumentCreateOneURLRequest,
  DocumentCreateResponse,
} from './dtos/document-create.dto';
import { DocumentDeleteRequest, DocumentDeleteResponse } from './dtos/document-delete.dto';
import { DocumentFindManyRequest, DocumentFindManyResponse, DocumentFindOnePublicResponse, DocumentFindOneResponse } from './dtos/document-find.dto';
import { DocumentPatchManyRequest, DocumentPatchOneRequest } from './dtos/document-patch.dto';

@Controller('knowledge-base/:assistantID/document')
@ApiTags('KnowledgeBaseDocument')
export class KnowledgeBaseDocumentPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseDocumentService)
    private readonly service: KnowledgeBaseDocumentService
  ) {}

  /* Create */
  @Post()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create url document',
    description: 'Create one url document by kb url data',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: DocumentCreateOneURLRequest })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: DocumentCreateResponse,
    description: 'Create one url document by kb url data in the target project',
  })
  async createOneURL(
    @UserID() userID: number,
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(DocumentCreateOneURLRequest)) body: DocumentCreateOneURLRequest
  ): Promise<DocumentCreateResponse> {
    const response = await this.service.createManyDocuments(assistantID, userID, { data: [body.data] });

    return response[0];
  }

  @Post('file')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload file document',
    description: 'Upload one url document',
  })
  @ApiBody({
    schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, canEdit: { type: 'boolean' } } },
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: DocumentCreateResponse,
    description: 'Create one file document in the target project',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB limit
      },
    })
  )
  async createOneFile(
    @UserID() userID: number,
    @Param('assistantID') assistantID: string,
    @UploadedFile() file: MulterFile,
    @Body() { canEdit }: { canEdit?: boolean }
  ): Promise<DocumentCreateResponse> {
    return this.service.uploadFileDocument(assistantID, userID, file, canEdit);
  }

  @Post('create-many')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create urls documents',
    description: 'Create many urls documents by kb url data array',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: DocumentCreateManyURLsRequest })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    schema: DocumentCreateManyResponse,
    description: 'Create many urls documents by kb url data array in the target project',
  })
  async createManyURLs(
    @UserID() userID: number,
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(DocumentCreateManyURLsRequest)) body: DocumentCreateManyURLsRequest
  ): Promise<DocumentCreateManyResponse> {
    return this.service.createManyDocuments(assistantID, userID, body);
  }

  /* Get */

  @Get(':documentID')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get document',
    description: 'Get one documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get document by id in the target project',
    schema: DocumentFindOneResponse,
  })
  async getOne(@Param('assistantID') assistantID: string, @Param('documentID') documentID: string): Promise<DocumentFindOneResponse> {
    return this.service.findOneDocument(assistantID, documentID);
  }

  @Get('public/:documentID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get document',
    description: 'Get one documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get document by id in the target project',
    schema: DocumentFindOnePublicResponse,
  })
  async publicGetOne(@Param('assistantID') assistantID: string, @Param('documentID') documentID: string): Promise<DocumentFindOnePublicResponse> {
    const document = await this.service.findOneDocument(assistantID, documentID);
    return document ? { data: document.data, chunks: document.chunks } : { data: null, chunks: [] };
  }

  @Get()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get many documents',
    description: 'Get all assistant documents',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiQuery({ schema: DocumentFindManyRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get all assistant documents',
    schema: DocumentFindManyResponse,
  })
  async getMany(
    @Param('assistantID') assistantID: string,
    @Query(new ZodValidationPipe(DocumentFindManyRequest)) query: DocumentFindManyRequest
  ): Promise<DocumentFindManyResponse> {
    const documents = await this.service.findManyDocuments(assistantID, query.documentIDs);
    return { documents };
  }

  @Post('retrieve-many')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get many documents',
    description: 'Get all assistant documents or get many documents by ids',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: DocumentFindManyRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get all assistant documents or get many documents by ids',
    schema: DocumentFindManyResponse,
  })
  async retrieveMany(
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(DocumentFindManyRequest)) { documentIDs }: DocumentFindManyRequest
  ): Promise<DocumentFindManyResponse> {
    const documents = await this.service.findManyDocuments(assistantID, documentIDs);
    return { documents };
  }

  /* Patch */

  @Post('update-many')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update many documents',
    description: 'Update many documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: DocumentPatchManyRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Update documents by id in the target project',
  })
  async patchMany(
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(DocumentPatchManyRequest)) { documentIDs, patch }: DocumentPatchManyRequest
  ): Promise<void> {
    await this.service.patchManyDocuments(assistantID, documentIDs, patch);
  }

  @Patch()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update many documents',
    description: 'Update many documents by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiBody({ schema: DocumentPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Update documents by id in the target project',
  })
  async patchOne(
    @Param('assistantID') assistantID: string,
    @Param('documentID') documentID: string,
    @Body(new ZodValidationPipe(DocumentPatchOneRequest)) document: DocumentPatchOneRequest
  ): Promise<void> {
    await this.service.patchOneDocument(assistantID, documentID, document);
  }

  /* Delete */

  @Delete(':documentID')
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
    await this.service.deleteManyDocuments([documentID], assistantID);
  }

  @Delete('public/:documentID')
  @ApiConsumes('knowledgeBase')
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
  async publicDeleteOne(@Param('assistantID') assistantID: string, @Param('documentID') documentID: string): Promise<void> {
    // TODO: remove from refresh queue
    await this.service.deleteManyDocuments([documentID], assistantID);
  }

  @Post('delete-many')
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
    await this.service.deleteManyDocuments(documentIDs, assistantID);

    return { deletedDocumentIDs: documentIDs };
  }
}
