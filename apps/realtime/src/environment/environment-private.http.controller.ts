import { Body, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { ProjectSerializer } from '@/project/project.serializer';

import { EnvironmentCloneRequest } from './dtos/environment-clone.request';
import { EnvironmentCloneResponse } from './dtos/environment-clone.response';
import { EnvironmentPreparePrototypeResponse } from './dtos/environment-prepare-prototype.response';
import { EnvironmentService } from './environment.service';

@Controller('private/environment')
@ApiTags('Private/Environment')
export class EnvironmentPrivateHTTPController {
  constructor(
    @Inject(EnvironmentService)
    private readonly service: EnvironmentService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer
  ) {}

  @Post(':environmentID/clone')
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiBody({ schema: EnvironmentCloneRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: EnvironmentCloneResponse })
  clone(
    @Param('environmentID') environmentID: string,
    @Body(new ZodValidationPipe(EnvironmentCloneRequest)) body: EnvironmentCloneRequest
  ): Promise<EnvironmentCloneResponse> {
    return this.service
      .cloneOneAndTransform({ ...body, cloneDiagrams: body.cloneDiagrams ?? false, sourceEnvironmentID: environmentID })
      .then((result) => ({
        ...this.service.toJSONWithSubResources(result),
        project: this.projectSerializer.nullable(result.project),
        liveDiagramIDs: result.liveDiagramIDs,
      }));
  }

  @Post(':environmentID/prepare-prototype')
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: EnvironmentPreparePrototypeResponse })
  preparePrototype(@Param('environmentID') environmentID: string): Promise<EnvironmentPreparePrototypeResponse> {
    return this.service.preparePrototype(environmentID).then((result) => ({
      ...this.service.toJSONWithSubResources(result),
      project: this.projectSerializer.nullable(result.project),
      liveDiagramIDs: result.liveDiagramIDs,
    }));
  }
}
