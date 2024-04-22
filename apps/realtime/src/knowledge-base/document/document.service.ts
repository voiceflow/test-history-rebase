import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class KnowledgeBaseDocumentService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM
  ) {
    super();
  }

  /* Delete */

  async deleteManyDocuments(ids: string[], assistantID: string) {
    await this.orm.deleteManyDocuments(assistantID, ids);
  }
}
