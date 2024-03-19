import type { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { VersionSettings } from '@voiceflow/dtos';
import { DiagramEntity, ORMMutateOptions, ToJSON, VersionEntity, VersionORM } from '@voiceflow/orm-designer';
import { Merge } from 'type-fest';

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
    protected readonly orm: VersionORM,
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
      sourceVersionOverride,
    }: {
      sourceVersion: Omit<ToJSON<VersionEntity>, 'id'>;
      sourceDiagrams: Omit<ToJSON<DiagramEntity>, 'id'>[];
      sourceVersionOverride?: Partial<ToJSON<VersionEntity>>;
    }
  ) {
    await Promise.all([this.deleteOne(versionID), this.diagram.deleteManyByVersionID(versionID)]);

    return this.importOneJSON({
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride: { _id: versionID, ...sourceVersionOverride },
    });
  }

  async importOne(
    {
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride = {},
    }: {
      sourceVersion: Merge<ToJSON<VersionEntity>, Partial<Pick<ToJSON<VersionEntity>, '_id' | 'id'>>>;
      sourceDiagrams: Merge<ToJSON<DiagramEntity>, Partial<Pick<ToJSON<DiagramEntity>, '_id' | 'id'>>>[];
      sourceVersionOverride?: Merge<Partial<ToJSON<VersionEntity>>, { prototype?: any }>;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const forNewProject = sourceVersionOverride.projectID && sourceVersionOverride.projectID !== sourceVersion.projectID;

    const versionData =
      forNewProject && sourceVersionOverride.creatorID
        ? deepSetCreatorID(deepSetNewDate(sourceVersion), sourceVersionOverride.creatorID)
        : sourceVersion;

    const newVersion = await this.createOne(
      {
        ...Utils.object.omit(versionData, ['_id', 'id']),
        ...sourceVersionOverride,
      },
      { flush: false }
    );

    const diagramOverride = { ...Utils.object.pick(sourceVersionOverride, ['creatorID']), versionID: newVersion.id };

    const newDiagrams = await this.diagram.createMany(
      sourceDiagrams.map((diagram) => ({ ...Utils.object.omit(diagram, ['_id', 'id']), ...diagramOverride })),
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
    return this.importOne({ sourceVersion, sourceDiagrams, sourceVersionOverride }, options);
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

    return this.importOne(
      {
        sourceVersion: sourceVersion.toJSON(),
        sourceDiagrams: sourceDiagrams.map((diagram) => diagram.toJSON()),
        sourceVersionOverride,
      },
      options
    );
  }

  findOneOrFailWithFields<Key extends keyof VersionEntity>(versionID: Primary<VersionEntity>, fields: [Key, ...Key[]]) {
    return this.orm.findOneOrFail(versionID, { fields });
  }

  async exists(versionID: Primary<VersionEntity>) {
    const version = await this.orm.findOne(versionID, { fields: ['_id'] });

    return !!version;
  }

  async updateOneSettings(versionID: Primary<VersionEntity>, settings: Partial<VersionSettings>) {
    await this.orm.updateOneSettings(versionID, settings);
  }
}
