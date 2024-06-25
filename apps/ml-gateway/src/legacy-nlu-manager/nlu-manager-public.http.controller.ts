import { Body, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Utils } from '@voiceflow/common';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { ConfigurationService } from './configuration.service';
import { IntentClarityRequest } from './dtos/intent-clarity-request.dto';
import { IntentClarityResponse } from './dtos/intent-clarity-response.dto';
import { InteractionService } from './interaction.service';

@Controller('nlu-manager')
@ApiTags('nlu-manager')
export class NLUManagerHTTPController {
  constructor(
    @Inject(ConfigurationService)
    private readonly configuration: ConfigurationService,
    @Inject(InteractionService)
    private readonly interaction: InteractionService
  ) {}

  @Post('/:environmentID/intent/clarity')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @ApiOperation({
    summary: 'Generate prompt completion',
    description: 'Generate prompt completion with a given model',
  })
  @ZodApiBody({ schema: IntentClarityRequest })
  @ZodApiResponse({
    status: HttpStatus.OK,
    schema: IntentClarityResponse,
    description: 'AI response',
  })
  async getIntentClarity(
    @Body(new ZodValidationPipe(IntentClarityRequest))
    { intents, slots, platform, topConflicting }: IntentClarityRequest,
    @Param('environmentID') environmentID: string
  ): Promise<IntentClarityResponse> {
    const config = await this.configuration.getConfiguration('nlumanage-pairwise');

    const { clarityByClass, overallScores, problematicSentences, utteranceMapper } = await this.interaction.sendRequest<
      any,
      any
    >(`${environmentID}.${Utils.id.cuid.slug()}`, config, {
      reqGUID: Utils.id.cuid(),
      // the order of the fields is important here!
      intents,
      platform,
      slots,
      topConflicting,
    });

    return { clarityByClass, overallScores, problematicSentences, utteranceMapper };
  }
}
