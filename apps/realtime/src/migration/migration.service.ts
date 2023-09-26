import { Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { LegacyService } from '@/legacy/legacy.service';

@Injectable()
export class MigrationService {
  constructor(private legacyService: LegacyService) {}

  public async getTargetSchemaVersion(versionID: string, proposedSchemaVersion: number) {
    return this.legacyService.services.migrate.getTargetSchemaVersion(versionID, proposedSchemaVersion);
  }

  // eslint-disable-next-line require-yield
  public async *migrateSchema(
    creatorID: number,
    projectID: string,
    versionID: string,
    clientNodeID: string,
    targetSchemaVersion: Realtime.SchemaVersion
  ): any {
    return this.legacyService.services.migrate.migrateSchema(creatorID, projectID, versionID, clientNodeID, targetSchemaVersion);
  }
}
