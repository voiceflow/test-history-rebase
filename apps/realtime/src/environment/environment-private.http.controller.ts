import { Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { ProjectSerializer } from '@/project/project.serializer';

import { EnvironmentPreparePrototypeResponse } from './dtos/environment-prepare-prototype.response';
import { EnvironmentAdapter } from './environment.adapter';
import { EnvironmentPrototypeService } from './environment-prototype.service';

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
  async preparePrototype(@Param('environmentID') environmentID: string): Promise<EnvironmentPreparePrototypeResponse> {
    const prototypeData = await this.prototypeService.preparePrototype(environmentID);

    const result: EnvironmentPreparePrototypeResponse = {
      ...this.adapter.toJSONWithSubResources(prototypeData),
      project: this.projectSerializer.nullable(prototypeData.project),
      liveDiagramIDs: prototypeData.liveDiagramIDs,
    };

    return result;
  }
}
