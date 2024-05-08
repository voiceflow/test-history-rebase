import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { VersionSettings } from '@voiceflow/dtos';
import { DiagramEntity, DiagramJSON, VersionEntity, VersionJSON, VersionObject, VersionORM } from '@voiceflow/orm-designer';
import { ObjectId } from 'mongodb';
import { Merge } from 'type-fest';

import { MutableService } from '@/common';
import { DiagramService } from '@/diagram/diagram.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';

@Injectable()
export class VersionService extends MutableService<VersionORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  static getLiveDiagramIDs(version: VersionObject, diagrams: DiagramEntity[]) {
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

  async patchOnePlatformData(versionID: string | ObjectId, platformData: AnyRecord) {
    await this.orm.patchOnePlatformData(versionID, platformData);
  }

  async replaceOne(
    versionID: string,
    {
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride,
    }: {
      sourceVersion: Omit<VersionJSON, 'id'>;
      sourceDiagrams: Omit<DiagramJSON, 'id'>[];
      sourceVersionOverride?: Partial<VersionJSON>;
    }
  ) {
    await Promise.all([this.deleteOne(versionID), this.diagram.deleteManyByVersionID(versionID)]);

    return this.importOneJSON({
      sourceVersion,
      sourceDiagrams,
      sourceVersionOverride: { _id: versionID, ...sourceVersionOverride },
    });
  }

  async importOne({
    sourceVersion,
    sourceDiagrams,
    sourceVersionOverride = {},
  }: {
    sourceVersion: Merge<VersionJSON, Partial<Pick<VersionJSON, '_id'>>>;
    sourceDiagrams: Merge<DiagramJSON, Partial<Pick<DiagramJSON, '_id'>>>[];
    sourceVersionOverride?: Merge<Partial<VersionJSON>, { prototype?: any }>;
  }) {
    const forNewProject = sourceVersionOverride.projectID && sourceVersionOverride.projectID !== sourceVersion.projectID;

    const versionData =
      forNewProject && sourceVersionOverride.creatorID
        ? deepSetCreatorID(deepSetNewDate(sourceVersion), sourceVersionOverride.creatorID)
        : sourceVersion;

    const newVersion = await this.orm.upsertOne(
      this.fromJSON({
        ...versionData,
        // upsert requires an explicit _id to return result, override versionData._id
        _id: new ObjectId().toJSON(),

        // sourceVersionOverride can override _id
        ...sourceVersionOverride,
      })
    );

    const diagramOverride = { ...Utils.object.pick(sourceVersionOverride, ['creatorID']), versionID: newVersion._id.toJSON() };

    const newDiagrams = await this.diagram.createMany(
      this.diagram.mapFromJSON(sourceDiagrams.map((diagram) => ({ ...Utils.object.omit(diagram, ['_id']), ...diagramOverride })))
    );

    return {
      version: newVersion,
      diagrams: newDiagrams,
    };
  }

  async findManyWithFields<Key extends keyof VersionJSON>(ids: string[], fields: Key[]) {
    return this.orm.findMany(ids, { fields });
  }

  findOneOrFailWithFields<Key extends keyof VersionJSON>(versionID: string, fields: [Key, ...Key[]]) {
    return this.orm.findOneOrFail(versionID, { fields });
  }

  async importOneJSON({
    sourceVersion,
    sourceDiagrams,
    sourceVersionOverride,
  }: {
    sourceVersion: Omit<VersionJSON, 'id'>;
    sourceDiagrams: Omit<DiagramJSON, 'id'>[];
    sourceVersionOverride?: Partial<VersionJSON>;
  }) {
    return this.importOne({ sourceVersion, sourceDiagrams, sourceVersionOverride });
  }

  async exportOne(versionID: string) {
    const [version, diagrams] = await Promise.all([this.findOneOrFail(versionID), this.diagram.findManyByVersionID(versionID)]);

    return {
      version,
      diagrams,
    };
  }

  async cloneOne({ sourceVersionID, sourceVersionOverride }: { sourceVersionID: string; sourceVersionOverride?: Partial<VersionJSON> }) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([
      this.findOneOrFail(sourceVersionID),
      this.diagram.findManyByVersionID(sourceVersionID),
    ]);

    return this.importOne({
      sourceVersion: this.toJSON(sourceVersion),
      sourceDiagrams: this.diagram.mapToJSON(sourceDiagrams),
      sourceVersionOverride,
    });
  }

  async exists(versionID: string) {
    const version = await this.orm.findOne(versionID, { fields: ['_id'] });

    return !!version;
  }

  async updateOneSettings(versionID: Primary<VersionEntity>, settings: Partial<VersionSettings>) {
    await this.orm.updateOneSettings(versionID, settings);
  }
}
