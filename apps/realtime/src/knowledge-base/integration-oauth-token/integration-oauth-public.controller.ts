import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { IntegrationType } from '@/common/clients/integrations/base/dtos/base-oauth-type.enum';

import { IntegrationAuthUrlParams, IntegrationAuthUrlResponse } from './dtos/integration-auth-url.dto';
import { IntegrationCallbackParams } from './dtos/integration-callback.dto';
import {
  ZendeskArticlesUploadRequest,
  ZendeskCountByFiltersResponse,
  ZendeskFiltersResponse,
  ZendeskUserSegmentsRequest,
} from './dtos/integration-filters.dto';
import { IntegrationFindManyResponse } from './dtos/integration-find.dto';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';

@Controller('knowledge-base')
@ApiTags('KnowledgeBaseIntegrations')
export class KnowledgeBaseIntegrationsPublicHTTPController {
  constructor(
    @Inject(IntegrationOauthTokenService)
    private readonly service: IntegrationOauthTokenService
  ) {}

  @Get('integrations/:integrationType/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Integration creation callback' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Integration creation callback',
  })
  async callbackIntegration(
    @Query(new ZodValidationPipe(IntegrationCallbackParams)) query: IntegrationCallbackParams,
    @Param('integrationType') integrationType: IntegrationType,
    @Req() req: Request
  ): Promise<void> {
    return this.service.callbackIntegration({ query, host: req.hostname, integrationType });
  }

  @Get(':assistantID/integrations')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get knowledge base integrations' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: IntegrationFindManyResponse,
    description: 'Get the knowledge base integrations',
  })
  async getIntegrations(@Param('assistantID') assistantID: string): Promise<IntegrationFindManyResponse> {
    return this.service.getManyIntegrationTokens(assistantID);
  }

  @Post(':assistantID/integrations/:integrationType')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload integration resources by provided filters' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.CREATED,
    description: 'Upload integration resources by provided filters',
  })
  @ZodApiBody({ schema: ZendeskArticlesUploadRequest })
  async uploadDocsByFiltersIntegration(
    @UserID() userID: number,
    @Param('assistantID') assistantID: string,
    @Param('integrationType') integrationType: IntegrationType,
    @Body() body?: ZendeskArticlesUploadRequest
  ): Promise<void> {
    await this.service.uploadDocsByFiltersIntegration({ assistantID, creatorID: userID, body, integrationType });
  }

  @Delete(':assistantID/integrations/:integrationType')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete knowledge base integration' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a knowledge base integration',
  })
  async deleteIntegration(@Param('assistantID') assistantID: string, @Param('integrationType') integrationType: IntegrationType): Promise<void> {
    return this.service.deleteIntegration(assistantID, integrationType);
  }

  @Get(':assistantID/integrations/:integrationType/auth-redirect-url')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get redirect url for finishing oauth integration process' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: IntegrationAuthUrlResponse,
    description: 'Get redirect url for finishing oauth integration process',
  })
  async authUrlIntegration(
    @UserID() userID: number,
    @Query(new ZodValidationPipe(IntegrationAuthUrlParams)) query: IntegrationAuthUrlParams,
    @Param('assistantID') assistantID: string,
    @Param('integrationType') integrationType: IntegrationType,
    @Req() req: Request
  ): Promise<IntegrationAuthUrlResponse> {
    return this.service.getAuthUrlIntegration({ assistantID, creatorID: userID, query, host: req.hostname, integrationType });
  }

  @Get(':assistantID/integrations/:integrationType/auth-reconnect-redirect-url')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reconnect redirect url for refreshing oauth integration' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: IntegrationAuthUrlResponse,
    description: 'Get reconnect redirect url for refreshing oauth integration',
  })
  async authUrlReconnectIntegration(
    @UserID() userID: number,
    @Query(new ZodValidationPipe(IntegrationAuthUrlParams)) query: IntegrationAuthUrlParams,
    @Param('assistantID') assistantID: string,
    @Param('integrationType') integrationType: IntegrationType,
    @Req() req: Request
  ): Promise<IntegrationAuthUrlResponse> {
    return this.service.getAuthUrlIntegration({ assistantID, creatorID: userID, query, host: req.hostname, integrationType, overwrite: true });
  }

  @Get(':assistantID/integrations/:integrationType/filters')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available integrations filters options' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: ZendeskFiltersResponse,
    description: 'Get available integrations filters options',
  })
  async fetchFiltersIntegration(
    @Query(new ZodValidationPipe(IntegrationAuthUrlParams)) query: IntegrationAuthUrlParams,
    @Param('assistantID') assistantID: string,
    @Param('integrationType') integrationType: IntegrationType
  ): Promise<ZendeskFiltersResponse> {
    return this.service.fetchFiltersIntegration({ assistantID, query, integrationType });
  }

  @Post(':assistantID/integrations/:integrationType/count')
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'project',
  }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available resources count' })
  @ApiParam({ name: 'integrationType', type: 'string' })
  @ApiParam({ name: 'assistantID', type: 'string' })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: ZendeskCountByFiltersResponse,
    description: 'Get available resources count',
  })
  @ZodApiBody({ schema: ZendeskUserSegmentsRequest })
  async fetchCountByFiltersIntegration(
    @Param('assistantID') assistantID: string,
    @Param('integrationType') integrationType: IntegrationType,
    @Body() body?: ZendeskUserSegmentsRequest
  ): Promise<ZendeskCountByFiltersResponse> {
    return this.service.fetchCountByFiltersIntegration({ assistantID, body, integrationType });
  }
}
