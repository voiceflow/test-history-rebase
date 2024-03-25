import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class PrototypeProgramService extends MutableService<PrototypeProgramORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(PrototypeProgramORM)
    protected readonly orm: PrototypeProgramORM
  ) {
    super();
  }

  findManyByVersionAndDiagramIDs(versionID: ObjectId, diagramIDs: ObjectId[]) {
    return this.orm.find({ versionID, diagramID: diagramIDs });
  }

  async deleteOlderThanForVersion(versionID: string, date: Date) {
    return this.orm.deleteOlderThanForVersion(versionID, date);
  }
}
