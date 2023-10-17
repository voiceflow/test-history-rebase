import { Inject, Injectable } from '@nestjs/common';
import { BackupORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class AssistantService extends MutableService<BackupORM> {
  constructor(
    @Inject(BackupORM)
    protected readonly orm: BackupORM
  ) {
    super();
  }
}
