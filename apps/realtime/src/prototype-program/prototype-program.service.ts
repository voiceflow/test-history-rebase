import { Inject, Injectable } from '@nestjs/common';
import { PrototypeProgramEntity, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

import { UpsertManyPrototypeProgramRequest } from './dtos/upsert-many-prototype-program-request.dto';

@Injectable()
export class PrototypeProgramService extends MutableService<PrototypeProgramORM> {
  constructor(
    @Inject(PrototypeProgramORM)
    protected readonly orm: PrototypeProgramORM
  ) {
    super();
  }

  async upsertMany(programs: UpsertManyPrototypeProgramRequest) {
    const programsEntities = programs.map((program) => new PrototypeProgramEntity(program));

    return this.orm.upsertMany(programsEntities);
  }

  async deleteOlderThanForVersion(versionID: string, date: Date) {
    return this.orm.deleteOlderThanForVersion(versionID, date);
  }
}
