import type { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { DiagramEntity, DiagramJSONAdapter, ORMMutateOptions, ToJSON, VersionEntity, VersionJSONAdapter, VersionORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { DiagramService } from '@/diagram/diagram.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';

@Injectable()
export class VersionService extends MutableService<VersionORM> {
  static getLiveDiagramIDs(version: VersionEntity, diagrams: DiagramEntity[]) {
    // if there are no domains in version, all diagrams are live
    if (!version.domains?.length) {
      return diagrams.map(({ diagramID }) => diagramID.toJSON());
    }

    const liveTopicIDs = new Set(version.domains.filter(({ live }) => live).flatMap(({ topicIDs }) => topicIDs));

    return diagrams
      .filter(({ diagramID, type }) => !type || type === BaseModels.Diagram.DiagramType.COMPONENT || liveTopicIDs.has(diagramID.toJSON()))
      .map(({ diagramID }) => diagramID.toJSON());
  }

  constructor(
    @Inject(VersionORM)
    readonly orm: VersionORM,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService
  ) {
    super();
  }

  async patchOnePlatformData(version: Primary<VersionEntity>, platformData: AnyRecord) {
    await this.orm.patchOnePlatformData(version, platformData);
  }

  async replaceOne(
    versionID: string,
    {
      sourceVersion,
      sourceDiagrams,
    }: {
      sourceVersion: ToJSON<VersionEntity>;
      sourceDiagrams: ToJSON<DiagramEntity>[];
    }
  ) {
    await Promise.all([this.deleteOne(versionID), this.diagram.deleteManyByVersionID(versionID)]);

    return this.importOneJSON({
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride: { _id: versionID },
    });
  }

  async importOne(
    {
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride = {},
    }: {
      sourceVersion: VersionEntity;
      sourceDiagrams: DiagramEntity[];
      sourceVersionOverride?: Partial<ToJSON<VersionEntity>>;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const forNewProject = sourceVersionOverride.projectID && sourceVersionOverride.projectID !== sourceVersion.projectID.toJSON();

    const versionJSON =
      forNewProject && sourceVersionOverride.creatorID
        ? VersionJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate({ ...sourceVersion }), sourceVersionOverride.creatorID))
        : sourceVersion.toJSON();
    const diagramsJSON = DiagramJSONAdapter.mapFromDB(sourceDiagrams);

    const newVersion = await this.createOne(
      {
        ...Utils.object.omit(versionJSON, ['_id', 'id']),
        ...sourceVersionOverride,
      },
      { flush: true }
    );

    const diagramOverride = { ...Utils.object.pick(sourceVersionOverride, ['creatorID']), versionID: newVersion.id };

    const newDiagrams = await this.diagram.createMany(
      diagramsJSON.map((diagram) => ({ ...Utils.object.omit(diagram, ['_id', 'id']), ...diagramOverride })),
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
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride,
    }: {
      sourceVersion: Omit<ToJSON<VersionEntity>, 'id'>;
      sourceDiagrams: Omit<ToJSON<DiagramEntity>, 'id'>[];
      sourceVersionOverride?: Partial<ToJSON<VersionEntity>>;
    },
    options?: ORMMutateOptions
  ) {
    return this.importOne(
      {
        sourceVersion: new VersionEntity(sourceVersion),
        sourceDiagrams: sourceDiagrams.map((diagram) => new DiagramEntity(diagram)),
        sourceVersionOverride,
      },
      options
    );
  }

  async exportOne(versionID: string) {
    const [version, diagrams] = await Promise.all([this.findOneOrFail(versionID), this.diagram.findManyByVersionID(versionID)]);

    return {
      version,
      diagrams,
    };
  }

  async cloneOne(
    { sourceVersionID, sourceVersionOverride }: { sourceVersionID: string; sourceVersionOverride?: Partial<ToJSON<VersionEntity>> },
    options?: ORMMutateOptions
  ) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([
      this.findOneOrFail(sourceVersionID),
      this.diagram.findManyByVersionID(sourceVersionID),
    ]);

    return this.importOne({ sourceVersion, sourceDiagrams, sourceVersionOverride }, options);
  }
}
