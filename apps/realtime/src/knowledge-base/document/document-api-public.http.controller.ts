import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseDocument } from '@voiceflow/dtos';
import { UnsupportedMediaTypeException } from '@voiceflow/exception';
import { ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Identity, Permission } from '@voiceflow/sdk-auth';
import { Authorize, Principal } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { appRef } from '@/app.ref';
import { MulterFile } from '@/file/types';

import { KnowledgeBaseDocumentService } from './document.service';
import {
  DocumentCreateOnePublicRequestBody,
  DocumentCreateOnePublicRequestParams,
  DocumentCreateOnePublicResponse,
  DocumentReplaceOnePublicRequestParams,
} from './dtos/document-create.dto';
import { DocumentFindManyPublicRequest, DocumentFindManyPublicResponse, DocumentFindOnePublicResponse } from './dtos/document-find.dto';
import { DocumentAttachTagsRequest } from './dtos/document-tag.dto';

@Controller('public/knowledge-base/document')
@ApiTags('KBPublicApiDocument')
@Authorize.Identity()
export class KnowledgeBaseDocumentApiPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseDocumentService)
    private readonly service: KnowledgeBaseDocumentService
  ) {}

  /* Create */

  @Post()
  @ApiConsumes('multipart/form-data')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create kb document public api',
    description: 'Create kb document public api by provided info',
  })
  @ApiHeader({
    name: 'content-type',
    schema: { type: 'string', description: 'The Content-Type header is used to indicate the media type of the resource' },
  })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create kb document public api by provided info',
    schema: DocumentCreateOnePublicResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB limit
      },
    })
  )
  @ZodApiBody({ schema: DocumentCreateOnePublicRequestBody })
  async publicCreateOne(
    @Req() request: Request,
    @Principal() principal: Identity & { legacy: { projectID: string }; createdBy: number },
    @Query(new ZodValidationPipe(DocumentCreateOnePublicRequestParams)) query: DocumentCreateOnePublicRequestParams,
    @UploadedFile() file?: MulterFile,
    @Body() body?: DocumentCreateOnePublicRequestBody
  ): Promise<DocumentCreateOnePublicResponse> {
    let document: KnowledgeBaseDocument | null = null;

    const formattedQuery = {
      ...query,
      overwrite: query.overwrite === 'true',
    };

    if (request.is('multipart/form-data') && file) {
      document = await this.service.uploadFileDocument({
        projectID: principal.legacy.projectID,
        userID: principal.createdBy,
        file,
        query: formattedQuery,
      });
    }

    if (request.is('application/json') && body) {
      document = await this.service.createOneUrlDocument({
        projectID: principal.legacy.projectID,
        userID: principal.createdBy,
        data: { data: body.data },
        query: formattedQuery,
      });
    }

    if (document !== null) {
      return {
        data: {
          tags: document.tags ?? [],
          documentID: document.documentID,
          data: document.data,
          updatedAt: document.updatedAt ?? new Date().toString(),
          status: document.status,
        },
      };
    }

    throw new UnsupportedMediaTypeException('invalid content type');
  }

  @Get(':documentID')
  @ApiConsumes('multipart/form-data')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get document',
    description: 'Get one documents by id',
  })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get document by id in the target project',
    schema: DocumentFindOnePublicResponse,
  })
  async publicGetOne(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Param('documentID') documentID: string
  ): Promise<DocumentFindOnePublicResponse> {
    const document = await this.service.findOneDocument(principal.legacy.projectID, documentID);
    return document ? { data: document.data, chunks: document.chunks } : { data: null, chunks: [] };
  }

  @Get()
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get many documents',
    description: 'Get all assistant documents or get many documents by filters',
  })
  @ZodApiQuery({ schema: DocumentFindManyPublicRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get all assistant documents or get many documents by filters',
    schema: DocumentFindManyPublicResponse,
  })
  async publicGetMany(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Query(new ZodValidationPipe(DocumentFindManyPublicRequest)) query: DocumentFindManyPublicRequest
  ): Promise<DocumentFindManyPublicResponse> {
    const formattedQuery = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      documentType: query.documentType,
      includeTags: typeof query.includeTags === 'string' ? [query.includeTags] : query.includeTags,
      excludeTags: typeof query.excludeTags === 'string' ? [query.excludeTags] : query.excludeTags,
      includeAllTagged: query.includeAllTagged === 'true',
      includeAllNonTagged: query.includeAllNonTagged === 'true',
    };

    return this.service.findManyDocumentsByFilters(principal.legacy.projectID, formattedQuery);
  }

  // eslint-disable-next-line max-params
  @Put(':documentID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Replace kb document public api',
    description: 'Replace kb document public api by provided info',
  })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ApiHeader({
    name: 'content-type',
    schema: { type: 'string', description: 'The Content-Type header is used to indicate the media type of the resource' },
  })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    description: 'Replace kb document public api by provided info',
    schema: DocumentCreateOnePublicResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB limit
      },
    })
  )
  @ZodApiBody({ schema: DocumentCreateOnePublicRequestBody })
  async replaceCreateOne(
    @Req() request: Request,
    @Principal() principal: Identity & { legacy: { projectID: string }; createdBy: number },
    @Param('documentID') documentID: string,
    @Query(new ZodValidationPipe(DocumentReplaceOnePublicRequestParams)) query: DocumentReplaceOnePublicRequestParams,
    @UploadedFile() file?: MulterFile,
    @Body() body?: DocumentCreateOnePublicRequestBody
  ): Promise<DocumentCreateOnePublicResponse> {
    let document: KnowledgeBaseDocument | null = null;

    const formattedQuery = {
      ...query,
      overwrite: true,
      tags: [],
    };

    if (request.is('multipart/form-data') && file) {
      document = await this.service.uploadFileDocument({
        projectID: principal.legacy.projectID,
        userID: principal.createdBy,
        file,
        query: formattedQuery,
        existingDocumentID: documentID,
      });
    }

    if (request.is('application/json') && body) {
      document = await this.service.createOneUrlDocument({
        projectID: principal.legacy.projectID,
        userID: principal.createdBy,
        data: { data: body.data },
        query: formattedQuery,
        existingDocumentID: documentID,
      });
    }

    if (document !== null) {
      return {
        data: {
          tags: document.tags ?? [],
          documentID: document.documentID,
          data: document.data,
          updatedAt: document.updatedAt ?? new Date().toString(),
          status: document.status,
        },
      };
    }

    throw new UnsupportedMediaTypeException('invalid content type');
  }

  @Delete(':documentID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete document',
    description: 'Delete one documents by id',
  })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete document by id in the target project',
  })
  async publicDeleteOne(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Param('documentID') documentID: string
  ): Promise<void> {
    await this.service.deleteManyDocuments([documentID], principal.legacy.projectID);
  }

  /* Tags */

  @Post(':documentID/tags/attach')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiBody({ schema: DocumentAttachTagsRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Attach many tags to one document by id in the target project',
  })
  async attachTagsOneDocument(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Param('documentID') documentID: string,
    @Body(new ZodValidationPipe(DocumentAttachTagsRequest)) { data }: DocumentAttachTagsRequest
  ): Promise<void> {
    await this.service.attachTagsOneDocument(principal.legacy.projectID, documentID, data.tags);
  }

  @Post(':documentID/tags/detach')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseDocumentService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Detach tags to one document',
    description: 'Detach many tags to one document by id',
  })
  @ApiParam({ name: 'documentID', type: 'string' })
  @ZodApiBody({ schema: DocumentAttachTagsRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Detach many tags to one document by id in the target project',
  })
  async detachTagsOneDocument(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Param('documentID') documentID: string,
    @Body(new ZodValidationPipe(DocumentAttachTagsRequest)) { data }: DocumentAttachTagsRequest
  ): Promise<void> {
    await this.service.detachTagsOneDocument(principal.legacy.projectID, documentID, data.tags);
  }
}
