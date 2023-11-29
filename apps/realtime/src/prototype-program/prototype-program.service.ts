import { Inject, Injectable } from '@nestjs/common';
import { PrototypeProgramORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class PrototypeProgramService extends MutableService<PrototypeProgramORM> {
  constructor(
    @Inject(PrototypeProgramORM)
    protected readonly orm: PrototypeProgramORM
  ) {
    super();
  }

  async deleteOlderThanForVersion(versionID: string, date: Date) {
    return this.orm.deleteOlderThanForVersion(versionID, date);
  }
}
