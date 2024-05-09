import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Logger, Param, Patch, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Identity, Permission } from '@voiceflow/sdk-auth';
import { Authorize, Principal } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { appRef } from '@/app.ref';

import { TagFindManyResponse, TagFindOneResponse } from './dtos/tag-find.dto';
import { TagPatchOneRequest, TagPatchOneResponse } from './dtos/tag-patch.dto';
import { KnowledgeBaseTagService } from './tag.service';

@Controller('knowledge-base/tags')
@Authorize.Identity()
@ApiTags('KnowledgeBaseTag')
export class KnowledgeBaseTagPublicHTTPController {
  logger = new Logger(KnowledgeBaseTagPublicHTTPController.name);

  constructor(
    @Inject(KnowledgeBaseTagService)
    private readonly service: KnowledgeBaseTagService
  ) {}

  @Get('public')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request>([Permission.PROJECT_READ], async (req) => ({
    id: await appRef.current.get(KnowledgeBaseTagService).resolveAssistantID(req),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tags',
    description: 'Get all tags in the target project',
  })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get all tags in the target project',
    schema: TagFindManyResponse,
  })
  async findAll(@Principal() principal: Identity & { legacy: { projectID: string } }): Promise<TagFindManyResponse> {
    const assistantID = principal.legacy.projectID;
    const tags = await this.service.getTags(assistantID);
    return { total: tags.length, data: tags };
  }

  @Get('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request>([Permission.PROJECT_READ], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseTagService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tag by id',
    description: 'Get tag by id in the target project',
  })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get tag by id in the target project',
    schema: TagFindOneResponse,
  })
  async findOne(@Principal() principal: Identity & { legacy: { projectID: string } }, @Param('tagID') tagID: string): Promise<TagFindOneResponse> {
    const tag = await this.service.getOneTag(principal.legacy.projectID, tagID);
    return { data: tag };
  }

  @Patch('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseTagService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Patch tag by id',
    description: 'Patch tag by id in the target project',
  })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiBody({ schema: TagPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Patch tag by id in the target project',
    schema: TagPatchOneResponse,
  })
  async patchOne(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Param('tagID') tagID: string,
    @Body(new ZodValidationPipe(TagPatchOneRequest)) { data }: TagPatchOneRequest
  ): Promise<TagPatchOneResponse> {
    const tag = await this.service.patchOneTag(principal.legacy.projectID, tagID, data);
    return { data: tag };
  }

  @Post('public')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseTagService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create tag',
    description: 'Create tag  in the target project',
  })
  @ZodApiBody({ schema: TagPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Create tag in the target project',
    schema: TagPatchOneResponse,
  })
  async createOne(
    @Principal() principal: Identity & { legacy: { projectID: string } },
    @Body(new ZodValidationPipe(TagPatchOneRequest)) { data }: TagPatchOneRequest
  ): Promise<TagPatchOneResponse> {
    const tag = await this.service.createOneTag(principal.legacy.projectID, data);
    return { data: tag };
  }

  @Delete('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request>([Permission.PROJECT_UPDATE], async (request) => ({
    id: await appRef.current.get(KnowledgeBaseTagService).resolveAssistantID(request),
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete tag',
    description: 'Delete one tag by id',
  })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete tag by id in the target project',
  })
  async deleteOne(@Principal() principal: Identity & { legacy: { projectID: string } }, @Param('tagID') tagID: string): Promise<void> {
    await this.service.deleteOneTag(principal.legacy.projectID, tagID);
  }
}
