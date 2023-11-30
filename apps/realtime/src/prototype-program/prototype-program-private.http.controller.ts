import { Body, Controller, Delete, Inject, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Utils } from '@voiceflow/common';
import { ZodApiBody } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { UpsertManyPrototypeProgramRequest } from './dtos/upsert-many-prototype-program-request.dto';
import { PrototypeProgramService } from './prototype-program.service';

@Controller('private/prototype-program')
@ApiTags('Private/Prototype-Program')
export class PrototypeProgramPrivateHTTPController {
  constructor(
    @Inject(PrototypeProgramService)
    private readonly service: PrototypeProgramService
  ) {}

  @Put()
  @ZodApiBody({ schema: UpsertManyPrototypeProgramRequest })
  @ApiOperation({
    summary: 'Upsert many prototype programs',
    description: 'Upsert many prototype programs',
  })
  async upsertMany(@Body(new ZodValidationPipe(UpsertManyPrototypeProgramRequest)) programs: UpsertManyPrototypeProgramRequest) {
    await this.service.upsertMany(programs.map((program) => Utils.object.omit(program, ['_id'])));
  }

  @Delete('/:versionID')
  @ApiOperation({
    summary: 'Delete all prototype programs for a version',
    description: 'Delete all prototype programs for a version and older than a date',
  })
  async deleteOlderThanForVersion(@Param('versionID') versionID: string, @Query('olderThan') olderThan: string) {
    await this.service.deleteOlderThanForVersion(versionID, new Date(olderThan));
  }
}
