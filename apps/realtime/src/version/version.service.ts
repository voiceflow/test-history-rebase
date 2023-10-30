import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { DiagramEntity, DiagramJSONAdapter, ObjectId, ToJSON, VersionEntity, VersionJSONAdapter, VersionORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { DiagramService } from '@/diagram/diagram.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';

@Injectable()
export class VersionService extends MutableService<VersionORM> {
  constructor(
    @Inject(VersionORM)
    protected readonly orm: VersionORM,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService
  ) {
    super();
  }

  async importOne({
    override,
    creatorID,
    sourceVersion,
    sourceDiagrams,
  }: {
    override?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>;
    creatorID: number;
    sourceVersion: VersionEntity;
    sourceDiagrams: DiagramEntity[];
  }) {
    const forNewAssistant = override?.projectID && override?.projectID !== sourceVersion.projectID.toJSON();

    const versionJSON = forNewAssistant
      ? VersionJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate(sourceVersion), creatorID))
      : sourceVersion.toJSON();
    const diagramsJSON = DiagramJSONAdapter.mapFromDB(sourceDiagrams);

    const newVersion = await this.createOne({
      ...Utils.object.omit(versionJSON, ['_id', 'id']),
      ...override,
      creatorID,
    });

    const newDiagrams = await this.diagram.createMany(
      diagramsJSON.map((diagram) => ({ ...Utils.object.omit(diagram, ['_id', 'id']), versionID: newVersion.id, creatorID }))
    );

    return {
      version: newVersion,
      diagrams: newDiagrams,
    };
  }

  async importOneJSON({
    override,
    creatorID,
    sourceVersion,
    sourceDiagrams,
  }: {
    override?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>;
    creatorID: number;
    sourceVersion: ToJSON<VersionEntity>;
    sourceDiagrams: ToJSON<DiagramEntity>[];
  }) {
    return this.importOne({
      override,
      creatorID,
      sourceVersion: new VersionEntity(sourceVersion),
      sourceDiagrams: sourceDiagrams.map((diagram) => new DiagramEntity(diagram)),
    });
  }

  async cloneOne(creatorID: number, versionID: string, override?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([this.findOneOrFail(versionID), this.diagram.findManyByVersionID(versionID)]);

    return this.importOne({ override, creatorID, sourceVersion, sourceDiagrams });
  }
}
