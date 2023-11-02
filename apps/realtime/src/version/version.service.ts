import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { DiagramEntity, DiagramJSONAdapter, ToJSON, VersionEntity, VersionJSONAdapter, VersionORM } from '@voiceflow/orm-designer';

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

  async importOne(
    {
      creatorID,
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride,
    }: {
      creatorID: number;
      sourceVersion: VersionEntity;
      sourceDiagrams: DiagramEntity[];
      sourceVersionOverride?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>;
    },
    { flush = true }: { flush?: boolean } = {}
  ) {
    const forNewProject = sourceVersionOverride?.projectID && sourceVersionOverride?.projectID !== sourceVersion.projectID.toJSON();

    const versionJSON = forNewProject
      ? VersionJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate({ ...sourceVersion }), creatorID))
      : sourceVersion.toJSON();
    const diagramsJSON = DiagramJSONAdapter.mapFromDB(sourceDiagrams);

    const newVersion = await this.createOne(
      {
        ...Utils.object.omit(versionJSON, ['_id', 'id']),
        ...sourceVersionOverride,
        creatorID,
      },
      { flush: false }
    );

    const newDiagrams = await this.diagram.createMany(
      diagramsJSON.map((diagram) => ({ ...Utils.object.omit(diagram, ['_id', 'id']), versionID: newVersion.id, creatorID })),
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      version: newVersion,
      diagrams: newDiagrams,
    };
  }

  async importOneJSON(
    {
      creatorID,
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride,
    }: {
      creatorID: number;
      sourceVersion: ToJSON<VersionEntity>;
      sourceDiagrams: ToJSON<DiagramEntity>[];
      sourceVersionOverride?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>;
    },
    options?: { flush?: boolean }
  ) {
    return this.importOne(
      {
        creatorID,
        sourceVersion: new VersionEntity(sourceVersion),
        sourceDiagrams: sourceDiagrams.map((diagram) => new DiagramEntity(diagram)),
        sourceVersionOverride,
      },
      options
    );
  }

  async cloneOne(creatorID: number, versionID: string, override?: Omit<Partial<ToJSON<VersionEntity>>, 'creatorID'>) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([this.findOneOrFail(versionID), this.diagram.findManyByVersionID(versionID)]);

    return this.importOne({ creatorID, sourceVersion, sourceDiagrams, sourceVersionOverride: override });
  }
}
