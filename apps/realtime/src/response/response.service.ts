/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import _ from 'lodash';

import { CMSTabularService } from '@/common';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import { ResponseLoguxService } from './response.logux.service';
import { ResponseRepository } from './response.repository';
import { ResponseCloneService } from './response-clone.service';
import { ResponseExportService } from './response-export.service';
import { ResponseImportService } from './response-import.service';
import { ResponseMigrationService } from './response-migration.service';

@Injectable()
export class ResponseService extends CMSTabularService<ResponseORM> {
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
    private readonly migrationService: ResponseMigrationService,
    @Inject(ResponseLoguxService)
    private readonly logux: ResponseLoguxService
  ) {
    super();
  }

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
    responseMessages,
  }: ResponseExportImportDataDTO) {
    await this.importManyWithSubResources(
      this.repository.fromJSONWithSubResources({
        responses,
        responseVariants: responseVariants ?? [],
        responseAttachments: responseAttachments ?? [],
        responseDiscriminators: responseDiscriminators ?? [],
        responseMessages: responseMessages ?? [],
      })
    );
  }

  createManyWithSubResources(...data: Parameters<typeof this.repository.createManyResponses>) {
    return this.repository.createManyResponses(...data);
  }

  upsertManyWithSubResources(...data: Parameters<typeof this.migrationService.upsertManyWithSubResources>) {
    return this.migrationService.upsertManyWithSubResources(...data);
  }

  collectRelationsToDelete(...data: Parameters<typeof this.repository.collectRelationsToDelete>) {
    return this.repository.collectRelationsToDelete(...data);
  }

  broadcastDeleteMany(...data: Parameters<typeof this.logux.broadcastDeleteMany>) {
    return this.logux.broadcastDeleteMany(...data);
  }

  broadcastAddMany(...data: Parameters<typeof this.logux.broadcastAddMany>) {
    return this.logux.broadcastAddMany(...data);
  }
}
