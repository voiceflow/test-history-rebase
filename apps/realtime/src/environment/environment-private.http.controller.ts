import { Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { ProjectSerializer } from '@/project/project.serializer';

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
