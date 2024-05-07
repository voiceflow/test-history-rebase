import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class KnowledgeBaseSettingsService extends MutableService<KnowledgeBaseORM> {
  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM
  ) {
    super();
  }
}
