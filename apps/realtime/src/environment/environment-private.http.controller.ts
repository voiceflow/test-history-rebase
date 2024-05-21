import { Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { ProjectSerializer } from '@/project/project.serializer';

import { EnvironmentAdapter } from './environment.adapter';
import { EnvironmentPreparePrototypeResponse } from './prototype/dtos/environment-prepare-prototype.response';
import { EnvironmentPrototypeService } from './prototype/prototype.service';

@Controller('private/environment')
@ApiTags('Private/Environment')
export class EnvironmentPrivateHTTPController {
  constructor(
    @Inject(EnvironmentPrototypeService)
    private readonly prototypeService: EnvironmentPrototypeService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(EnvironmentAdapter)
    private readonly adapter: EnvironmentAdapter
  ) {}

  @Post(':environmentID/prepare-prototype')
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: EnvironmentPreparePrototypeResponse })
  preparePrototype(@Param('environmentID') environmentID: string): Promise<EnvironmentPreparePrototypeResponse> {
    return this.prototypeService.preparePrototype(environmentID).then((result) => ({
      ...this.adapter.toJSONWithSubResources(result),
      project: this.projectSerializer.nullable(result.project),
      liveDiagramIDs: result.liveDiagramIDs,
    }));
  }
}
