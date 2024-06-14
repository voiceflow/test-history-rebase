/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import _ from 'lodash';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import { ResponseRepository } from './response.repository';
import { ResponseCloneService } from './response-clone.service';
import { ResponseExportService } from './response-export.service';
import { ResponseImportService } from './response-import.service';
import { ResponseMigrationService } from './response-migration.service';

@Injectable()
export class ResponseService {
  constructor(
    @Inject(ResponseORM)
    protected readonly orm: ResponseORM,
    @Inject(RequiredEntityORM)
    protected readonly requiredEntityORM: RequiredEntityORM,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository,
    @Inject(ResponseExportService)
    private readonly exportService: ResponseExportService,
    @Inject(ResponseCloneService)
    private readonly cloneService: ResponseCloneService,
    @Inject(ResponseImportService)
    private readonly importService: ResponseImportService,
    @Inject(ResponseMigrationService)
    private readonly migrationService: ResponseMigrationService
  ) {}

  toJSONWithSubResources(...data: Parameters<typeof this.repository.toJSONWithSubResources>) {
    return this.repository.toJSONWithSubResources(...data);
  }

  fromJSONWithSubResources(...data: Parameters<typeof this.repository.fromJSONWithSubResources>) {
    return this.repository.fromJSONWithSubResources(...data);
  }

  prepareExportData(...data: Parameters<typeof this.exportService.prepareExportData>) {
    return this.exportService.prepareExportData(...data);
  }

  cloneManyWithSubResourcesForEnvironment(
    ...data: Parameters<typeof this.cloneService.cloneManyWithSubResourcesForEnvironment>
  ) {
    return this.cloneService.cloneManyWithSubResourcesForEnvironment(...data);
  }

  prepareImportData(...data: Parameters<typeof this.importService.prepareImportData>) {
    return this.importService.prepareImportData(...data);
  }

  importManyWithSubResources(...data: Parameters<typeof this.importService.importManyWithSubResources>) {
    return this.importService.importManyWithSubResources(...data);
  }

  async importManyWithSubResourcesFromJSON({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
  }: ResponseExportImportDataDTO) {
    await this.importManyWithSubResources(
      this.repository.fromJSONWithSubResources({
        responses,
        responseVariants: responseVariants ?? [],
        responseAttachments: responseAttachments ?? [],
        responseDiscriminators: responseDiscriminators ?? [],
      })
    );
  }

  createManyWithSubResources(...data: Parameters<typeof this.repository.createManyResponses>) {
    return this.repository.createManyResponses(...data);
  }

  upsertManyWithSubResources(...data: Parameters<typeof this.migrationService.upsertManyWithSubResources>) {
    return this.migrationService.upsertManyWithSubResources(...data);
  }
}
