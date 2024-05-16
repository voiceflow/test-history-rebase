/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { DiagramObject, VersionJSON, VersionObject } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';
import { Merge } from 'type-fest';

import { EnvironmentCloneService } from './clone/clone.service';
import { EnvironmentAdapter } from './environment.adapter';
import { EnvironmentCMSData, IntentsAndEntitiesData, MigrationDataMeta } from './environment.interface';
import { EnvironmentRepository } from './environment.repository';
import { EnvironmentExportService } from './export/export.service';
import { EnvironmentImportDTO } from './import/dtos/environment-import-data.dto';
import { EnvironmentImportService, ImportData } from './import/import.service';
import { EnvironmentMigrationService } from './migration/migration.service';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject(EnvironmentRepository)
    private readonly environmentRepository: EnvironmentRepository,
    @Inject(EnvironmentMigrationService)
    private readonly environmentMigrationService: EnvironmentMigrationService,
    @Inject(EnvironmentExportService)
    private readonly environmentExportService: EnvironmentExportService,
    @Inject(EnvironmentImportService)
    private readonly environmentImportService: EnvironmentImportService,
    @Inject(EnvironmentCloneService)
    private readonly environmentCloneService: EnvironmentCloneService,
    @Inject(EnvironmentAdapter)
    private readonly environmentAdapter: EnvironmentAdapter
  ) {}

  public async findManyForAssistantID(assistantID: string) {
    return this.environmentRepository.findManyForAssistantID(assistantID);
  }

  public async findOneCMSData(environmentID: string) {
    return this.environmentRepository.findOneCMSData(environmentID);
  }

  public async findOneCMSDataToMigrate(environmentID: string) {
    return this.environmentRepository.findOneCMSDataToMigrate(environmentID);
  }

  public async deleteOne(environmentID: string) {
    return this.environmentRepository.deleteOne(environmentID);
  }

  async upsertIntentsAndEntities(
    {
      intents,
      entities,
      responses,
      utterances,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseDiscriminators,
    }: IntentsAndEntitiesData,
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    return this.environmentRepository.upsertIntentsAndEntities({
      intents,
      entities,
      responses,
      utterances,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseDiscriminators,
    }, meta);
  }

  public async migrateCMSData(data: Realtime.Migrate.MigrationData, patches: Patch[], meta: MigrationDataMeta) {
    return this.environmentMigrationService.migrateCMSData(data, patches, meta);
  }

  public async prepareExportCMSData(data: EnvironmentCMSData, context: { userID: number; backup?: boolean; workspaceID: number }) {
    return this.environmentExportService.prepareExportCMSData(data, context);
  }

  public async exportJSON(context: { userID: number; workspaceID: number; environmentID: string }) {
    return this.environmentExportService.exportJSON(context);
  }

  public async prepareExportData(data: {
    cms: EnvironmentCMSData | null;
    version: VersionObject;
    diagrams: DiagramObject[];
  },
  context: { userID: number; backup?: boolean; workspaceID: number; centerDiagrams?: boolean }) {
    return this.environmentExportService.prepareExportData(data, context);
  }

  public async importJSON(params: {
    data: ImportData;
    userID: number;
    workspaceID: number;
    assistantID: string;
    environmentID: string;
  }) {
    return this.environmentImportService.importJSON(params);
  }

  public async prepareImportData(data: EnvironmentImportDTO,
    context: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string; centerDiagrams?: boolean }) {
    return this.environmentImportService.prepareImportCMSData(data, context);
  }

  public async cloneOne({
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
  }: {
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Merge<Partial<Omit<VersionJSON, '_id' | 'prototype'>>, { prototype?: any }>;
  }) {
    return this.environmentCloneService.cloneOne({ sourceEnvironmentID, targetEnvironmentID, targetVersionOverride });
  }

  public async toJSONCMSData(data: EnvironmentCMSData) {
    return this.environmentAdapter.toJSONCMSData(data);
  }

  toJSONWithSubResources(data: EnvironmentCMSData & { version: VersionObject; diagrams: DiagramObject[] }) {
    return this.environmentAdapter.toJSONWithSubResources(data);
  }
}
