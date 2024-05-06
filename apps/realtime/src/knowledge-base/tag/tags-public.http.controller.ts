import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { TagFindManyResponse, TagFindOneResponse } from './dtos/tag-find.dto';
import { TagPatchOneRequest, TagPatchOneResponse } from './dtos/tag-patch.dto';
import { KnowledgeBaseTagService } from './tag.service';

@Controller('knowledge-base/:assistantID/tags')
@ApiTags('KnowledgeBaseTag')
export class KnowledgeBaseTagPublicHTTPController {
  constructor(
    @Inject(KnowledgeBaseTagService)
    private readonly service: KnowledgeBaseTagService
  ) {}

  @Get('public')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (req) => ({ id: req.params.assistantID, kind: 'project' }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tags',
    description: 'Get all tags in the target project',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get all tags in the target project',
    schema: TagFindManyResponse,
  })
  async findAll(@Param('assistantID') assistantID: string): Promise<TagFindManyResponse> {
    const tags = await this.service.getTags(assistantID);
    return { total: tags.length, data: tags };
  }

  @Get('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tag by id',
    description: 'Get tag by id in the target project',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Get tag by id in the target project',
    schema: TagFindOneResponse,
  })
  async findOne(@Param('assistantID') assistantID: string, @Param('tagID') tagID: string): Promise<TagFindOneResponse> {
    const tag = await this.service.getOneTag(assistantID, tagID);
    return { data: tag };
  }

  @Patch('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Patch tag by id',
    description: 'Patch tag by id in the target project',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiBody({ schema: TagPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Patch tag by id in the target project',
    schema: TagPatchOneResponse,
  })
  async patchOne(
    @Param('assistantID') assistantID: string,
    @Param('tagID') tagID: string,
    @Body(new ZodValidationPipe(TagPatchOneRequest)) { data }: TagPatchOneRequest
  ): Promise<TagPatchOneResponse> {
    const tag = await this.service.patchOneTag(assistantID, tagID, data);
    return { data: tag };
  }

  @Post('public')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create tag',
    description: 'Create tag  in the target project',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiBody({ schema: TagPatchOneRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Create tag in the target project',
    schema: TagPatchOneResponse,
  })
  async createOne(
    @Param('assistantID') assistantID: string,
    @Body(new ZodValidationPipe(TagPatchOneRequest)) { data }: TagPatchOneRequest
  ): Promise<TagPatchOneResponse> {
    const tag = await this.service.createOneTag(assistantID, data);
    return { data: tag };
  }

  @Delete('public/:tagID')
  @ApiConsumes('knowledgeBase')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete tag',
    description: 'Delete one tag by id',
  })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'tagID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete tag by id in the target project',
  })
  async deleteOne(@Param('assistantID') assistantID: string, @Param('tagID') tagID: string): Promise<void> {
    await this.service.deleteOneTag(assistantID, tagID);
  }
}
