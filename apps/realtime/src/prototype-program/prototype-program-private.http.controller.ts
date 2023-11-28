import { Body, Controller, Delete, Inject, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrototypeProgramDTO } from '@voiceflow/dtos';
import { ZodApiBody } from '@voiceflow/nestjs-common';
import { ZodValidationPipe } from 'nestjs-zod';

import { EntitySerializer } from '@/common';

import { UpsertManyPrototypeProgramRequest } from './dtos/upsert-many-prototype-program-request.dto';
import { PrototypeProgramService } from './prototype-program.service';

@Controller('private/prototype-program')
@ApiTags('Private/Prototype-Program')
export class PrototypeProgramPrivateHTTPController {
  constructor(
    @Inject(PrototypeProgramService)
    private readonly service: PrototypeProgramService,

    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Put()
  @ZodApiBody({ schema: UpsertManyPrototypeProgramRequest })
  @ApiOperation({
    summary: 'Upsert many prototype programs',
    description: 'Upsert many prototype programs',
  })
  async upsertMany(
    @Body(new ZodValidationPipe(UpsertManyPrototypeProgramRequest)) programs: UpsertManyPrototypeProgramRequest
  ): Promise<PrototypeProgramDTO[]> {
    return this.service.upsertMany(programs).then(this.entitySerializer.iterable);
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
