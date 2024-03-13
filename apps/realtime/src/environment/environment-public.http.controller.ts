import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';

import { GetNLUTrainingDiffResponse } from './dtos/environment-get-nlu-training-diff.response';
import { EnvironmentService } from './environment.service';

@Controller('environment')
@ApiTags('Environment')
export class EnvironmentPublicHTTPController {
  constructor(
    @Inject(EnvironmentService)
    private readonly service: EnvironmentService
  ) {}

  @Get(':environmentID/nlu-training-diff')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiResponse({ schema: GetNLUTrainingDiffResponse })
  getNluTrainingDiff(@Param('environmentID') environmentID: string): Promise<GetNLUTrainingDiffResponse> {
    return this.service.getNLUTrainingDiff(environmentID);
  }
}
