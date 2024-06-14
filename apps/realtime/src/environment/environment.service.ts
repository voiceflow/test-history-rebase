/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import {
  AnyResponseVariant,
  Entity,
  EntityVariant,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
} from '@voiceflow/dtos';
import { DiagramObject, VersionJSON, VersionObject } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';
import { Merge } from 'type-fest';

import { EnvironmentCMSImportDataDTO } from './dtos/environment-cms-import-data.dto';
import { EnvironmentExportDTO } from './dtos/environment-export-data.dto';
import { EnvironmentImportDTO } from './dtos/environment-import-data.dto';
import { EnvironmentAdapter } from './environment.adapter';
import { EnvironmentCMSData } from './environment.interface';
import { EnvironmentRepository } from './environment.repository';
import { EnvironmentCloneService } from './environment-clone.service';
import { EnvironmentExportService } from './environment-export.service';
import { EnvironmentImportService } from './environment-import.service';
import { EnvironmentMigrationService } from './environment-migration.service';
import { EnvironmentNLUTrainingService } from './environment-nlu-training.service';
import { EnvironmentPrototypeService } from './environment-prototype.service';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject(EnvironmentPrototypeService)
    private readonly prototype: EnvironmentPrototypeService,
    @Inject(EnvironmentAdapter)
    private readonly adapter: EnvironmentAdapter,
    @Inject(EnvironmentRepository)
    private readonly repository: EnvironmentRepository,
    @Inject(EnvironmentImportService)
    private readonly importService: EnvironmentImportService,
    @Inject(EnvironmentExportService)
    private readonly exportService: EnvironmentExportService,
    @Inject(EnvironmentMigrationService)
    private readonly migrationService: EnvironmentMigrationService,
    @Inject(EnvironmentCloneService)
    private readonly cloneService: EnvironmentCloneService,
    @Inject(EnvironmentNLUTrainingService)
    private readonly nluTrainingService: EnvironmentNLUTrainingService
  ) {}

  /* Adapter */

  toJSONCMSData(data: EnvironmentCMSData) {
    return this.adapter.toJSONCMSData(data);
  }

  /* Repository (query and mutations to environment) */

  async findManyForAssistantID(assistantID: string) {
    return this.repository.findManyForAssistantID(assistantID);
  }

  async findOneCMSData(environmentID: string) {
    return this.repository.findOneCMSData(environmentID);
  }

  async findOneCMSDataToMigrate(environmentID: string) {
    return this.repository.findOneCMSDataToMigrate(environmentID);
  }

  async upsertIntentsAndEntities(
    data: {
      intents: Intent[];
      entities: Entity[];
      responses: Response[];
      utterances: Utterance[];
      entityVariants: EntityVariant[];
      requiredEntities: RequiredEntity[];
      responseVariants: AnyResponseVariant[];
      responseDiscriminators: ResponseDiscriminator[];
    },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    return this.migrationService.upsertIntentsAndEntities(data, meta);
  }

  async deleteOneCMSData(environmentID: string) {
    return this.repository.deleteOneCMSData(environmentID);
  }

  async deleteOne(environmentID: string) {
    return this.repository.deleteOne(environmentID);
  }

  /* Prototype */

  async preparePrototype(environmentID: string) {
    return this.prototype.preparePrototype(environmentID);
  }

  /* Import  */

  prepareImportData(
    data: EnvironmentImportDTO,
    context: {
      userID: number;
      backup?: boolean;
      workspaceID: number;
      assistantID: string;
      environmentID: string;
      centerDiagrams?: boolean;
    }
  ) {
    return this.importService.prepareImportData(data, context);
  }

  public async importJSON({
    data,
    userID,
    assistantID,
    environmentID,
  }: {
    data: ReturnType<EnvironmentService['prepareImportData']>;
    userID: number;
    assistantID: string;
    environmentID: string;
  }) {
    return this.importService.importJSON({ data, userID, assistantID, environmentID });
  }

  prepareImportCMSData(
    cms: EnvironmentCMSImportDataDTO,
    context: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string }
  ) {
    return this.importService.prepareImportCMSData(cms, context);
  }

  async importCMSData(importData: ReturnType<EnvironmentService['prepareImportCMSData']>) {
    return this.importService.importCMSData(importData);
  }

  /* Export  */

  public prepareExportCMSData(
    data: EnvironmentCMSData,
    context: { userID: number; backup?: boolean; workspaceID: number }
  ) {
    return this.exportService.prepareExportCMSData(data, context);
  }

  public prepareExportData(
    data: {
      cms: EnvironmentCMSData | null;
      version: VersionObject;
      diagrams: DiagramObject[];
    },
    context: { userID: number; backup?: boolean; workspaceID: number; centerDiagrams?: boolean }
  ): EnvironmentExportDTO {
    return this.exportService.prepareExportData(data, context);
  }

  public async exportJSON(environmentID: string) {
    return this.exportService.exportJSON(environmentID);
  }

  /* Migration */

  async migrateCMSData(
    data: Realtime.Migrate.MigrationData,
    patches: Patch[],
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    return this.migrationService.migrateCMSData(data, patches, meta);
  }

  /* Clone */

  async cloneOne(params: {
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Merge<Partial<Omit<VersionJSON, '_id' | 'prototype'>>, { prototype?: any }>;
  }) {
    return this.cloneService.cloneOne(params);
  }

  /* NLU */

  async getNLUTrainingDiff(environmentID: string) {
    return this.nluTrainingService.getNLUTrainingDiff(environmentID);
  }
}
