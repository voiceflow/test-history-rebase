import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, ProgramORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ProgramService extends MutableService<ProgramORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ProgramORM)
    protected readonly orm: ProgramORM
  ) {
    super();
  }

  findManyByVersionAndDiagramIDs(versionID: ObjectId, diagramIDs: ObjectId[]) {
    return this.orm.find({ versionID, diagramID: diagramIDs });
  }
}
