/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { BackupEntity, BackupORM, DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import dayjs from 'dayjs';

import { AssistantService } from '@/assistant/assistant.service';
import { AssistantExportImportDataDTO } from '@/assistant/dtos/assistant-export-import-data.dto';
import { MutableService } from '@/common';
import { EnvironmentService } from '@/environment/environment.service';
import { FileService } from '@/file/file.service';
import { UploadType } from '@/file/types';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

@Injectable()
export class BackupService extends MutableService<BackupORM> {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    @Inject(BackupORM)
    protected readonly orm: BackupORM,
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    protected readonly mongoEM: EntityManager,
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(FileService)
    private readonly file: FileService,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(AssistantService)
    private readonly assistant: AssistantService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService
  ) {
    super();
  }

  /* Create */

  async createOneForUser(userID: number, versionID: string, name: string) {
    return this.postgresEM.transactional(async () => {
      const version = await this.version.findOneOrFail(versionID);
      const vfFile = await this.assistant.exportJSON({
        userID,
        backup: true,
        assistantID: version.projectID.toHexString(),
        environmentID: versionID,
      });

      const filename = `${versionID}-${dayjs(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.json`;

      await this.file.uploadFile(UploadType.BACKUP, filename, JSON.stringify(vfFile));

      return this.createOne({ s3ObjectRef: filename, name, assistantID: vfFile.project._id, createdByID: userID });
    });
  }

  findManyForAssistantID(assistantID: string, options: { limit: number; offset: number }) {
    return this.orm.find({ assistantID }, { ...options, orderBy: { createdAt: 'DESC' } });
  }

  async downloadBackup(backupID: number): Promise<AssistantExportImportDataDTO> {
    const backup = await this.findOneOrFail(backupID);
    const file = await this.file.downloadFile(UploadType.BACKUP, backup.s3ObjectRef);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return JSON.parse(await file.transformToString());
  }

  async deleteOne(backupID: number) {
    const backup = await this.findOneOrFail(backupID);

    const result = await super.deleteOne(backupID);

    await this.file.deleteFile(UploadType.BACKUP, backup.s3ObjectRef);

    return result;
  }

  async restoreBackupAndEjectUsers(authMeta: AuthMetaPayload, backupID: number) {
    return this.postgresEM.transactional(async () => {
      const backup = await this.findOneOrFail(backupID);
      const project = await this.project.findOneOrFail(backup.assistantID);

      if (!project?.devVersion) {
        throw new Error('Project does not have a development version');
      }

      this.logux
        .processAs(
          Realtime.project.ejectUsers({
            projectID: backup.assistantID,
            creatorID: authMeta.userID,
            workspaceID: this.hashedID.encodeWorkspaceID(project.teamID),
            reason: Realtime.project.EjectUsersReason.BACKUP_RESTORE,
          }),
          authMeta
        )
        .catch((error) => this.logger.error(error));

      try {
        await this.restoreBackup(authMeta.userID, backup, project.devVersion.toString());
      } catch (error) {
        this.logger.error(error);
        throw new Error('Failed to restore backup');
      }

      return backup;
    });
  }

  async getBackupFile(s3ObjectRef: string) {
    const file = await this.file.downloadFile(UploadType.BACKUP, s3ObjectRef);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return AssistantExportImportDataDTO.parse(JSON.parse(await file.transformToString()));
  }

  private async restoreBackup(userID: number, backup: BackupEntity, versionID: string) {
    const [vfFile, project] = await Promise.all([this.getBackupFile(backup.s3ObjectRef), this.project.findOneOrFail(backup.assistantID)]);

    // create backup before restoring
    await this.createOneForUser(userID, versionID, 'Automatic before restore');

    await this.environment.deleteOne(backup.assistantID, versionID);

    const importData = this.environment.prepareImportData(vfFile, {
      userID,
      backup: true,
      workspaceID: this.hashedID.decodeWorkspaceID(vfFile.project.teamID),
      assistantID: backup.assistantID,
      environmentID: versionID,
    });

    await this.environment.importJSON({
      data: importData,
      userID,
      workspaceID: project.teamID,
      assistantID: backup.assistantID,
      environmentID: versionID,
    });
  }

  async previewBackup(backupID: number, userID: number) {
    return this.postgresEM.transactional(async () => {
      const backup = await this.findOneOrFail(backupID);
      const [vfFile, project] = await Promise.all([this.getBackupFile(backup.s3ObjectRef), this.project.findOneOrFail(backup.assistantID)]);

      const previewVersionID = project.previewVersion?.toJSON() ?? new ObjectId().toString();

      if (project.previewVersion) {
        await this.environment.deleteOne(project.id, project.previewVersion.toJSON());
      }

      const importData = this.environment.prepareImportData(vfFile, {
        userID,
        backup: true,
        workspaceID: project.teamID,
        assistantID: backup.assistantID,
        environmentID: previewVersionID,
      });

      await this.environment.importJSON({
        data: importData,
        userID,
        workspaceID: project.teamID,
        assistantID: backup.assistantID,
        environmentID: previewVersionID,
      });

      if (!project.previewVersion) {
        await this.project.patchOne(project.id, { previewVersion: previewVersionID });
      }

      return previewVersionID;
    });
  }
}
