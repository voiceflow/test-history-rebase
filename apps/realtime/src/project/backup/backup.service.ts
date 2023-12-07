/* eslint-disable max-params */
import { EntityManager as MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { BackupEntity, BackupORM, DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import dayjs from 'dayjs';

import { AssistantService } from '@/assistant/assistant.service';
import { AssistantExportJSONResponse } from '@/assistant/dtos/assistant-export-json.response';
import { MutableService } from '@/common';
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
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    protected readonly mongoEntityManager: MongoEntityManager
  ) {
    super();
  }

  /* Create */

  async createOneForUser(userID: number, versionID: string, name: string) {
    const version = await this.version.findOneOrFail(versionID);
    const vfFile = await this.assistant.exportJSON({ userID, assistantID: version.projectID.toHexString(), environmentID: versionID });

    const filename = `${versionID}-${dayjs(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.json`;

    await this.file.uploadFile(UploadType.BACKUP, filename, JSON.stringify(vfFile));

    return this.createOne({ s3ObjectRef: filename, name, assistantID: vfFile.project._id, createdByID: userID });
  }

  findManyForAssistantID(assistantID: string, options: { limit: number; offset: number }) {
    return this.orm.find({ assistantID }, { ...options, orderBy: { createdAt: 'DESC' } });
  }

  async downloadBackup(backupID: number): Promise<AssistantExportJSONResponse> {
    const backup = await this.findOneOrFail(backupID);
    const file = await this.file.downloadFile(UploadType.BACKUP, backup.s3ObjectRef);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return JSON.parse(await file.transformToString());
  }

  async deleteOne(backupID: number) {
    const backup = await this.findOneOrFail(backupID);

    await this.file.deleteFile(UploadType.BACKUP, backup.s3ObjectRef);

    return super.deleteOne(backupID);
  }

  async restoreBackupAndEjectUsers(authMeta: AuthMetaPayload, backupID: number) {
    const backup = await this.findOneOrFail(backupID);
    const project = await this.project.findOneOrFail(backup.assistantID);

    if (!project?.devVersion) {
      throw new Error('Project does not have a development version');
    }

    try {
      await this.restoreBackup(authMeta.userID, backup, project.devVersion.toString());
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to restore backup');
    }

    await this.logux.processAs(
      Realtime.project.ejectUsers({
        projectID: backup.assistantID,
        creatorID: authMeta.userID,
        workspaceID: this.hashedID.encodeWorkspaceID(project.teamID),
        reason: Realtime.project.EjectUsersReason.BACKUP_RESTORE,
      }),
      authMeta
    );

    return backup;
  }

  async getBackupFile(s3ObjectRef: string) {
    const file = await this.file.downloadFile(UploadType.BACKUP, s3ObjectRef);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const data: AssistantExportJSONResponse = JSON.parse(await file.transformToString());

    return data;
  }

  async restoreBackup(userID: number, backup: BackupEntity, versionID: string) {
    const vfFile = await this.getBackupFile(backup.s3ObjectRef);

    // create backup before restoring
    await this.createOneForUser(userID, versionID, 'Automatic before restore');

    const importData = this.assistant.prepareImportData(vfFile, {
      userID,
      workspaceID: this.hashedID.decodeWorkspaceID(vfFile.project.teamID),
      assistantID: backup.assistantID,
      environmentID: versionID,
      settingsAiAssist: false,
    });

    await this.version.replaceOne(versionID, {
      sourceVersion: importData.version,
      sourceDiagrams: importData.diagrams,
      sourceVersionOverride: { creatorID: userID },
    });

    await this.assistant.deleteCMSResources(backup.assistantID, versionID);
    await this.assistant.importCMSResources(importData);
  }

  async previewBackup(backupID: number, userID: number) {
    const backup = await this.findOneOrFail(backupID);
    const [vfFile, project] = await Promise.all([this.getBackupFile(backup.s3ObjectRef), this.project.findOneOrFail(backup.assistantID)]);

    const previewVersionID = project.previewVersion?.toJSON() ?? new ObjectId().toString();

    const importData = this.assistant.prepareImportData(vfFile, {
      userID,
      backup: true,
      workspaceID: project.teamID,
      assistantID: backup.assistantID,
      environmentID: previewVersionID,
      settingsAiAssist: false,
    });

    if (project.previewVersion) {
      await this.version.replaceOne(previewVersionID, {
        sourceVersion: importData.version,
        sourceDiagrams: importData.diagrams,
        sourceVersionOverride: { creatorID: userID },
      });

      await this.assistant.deleteCMSResources(backup.assistantID, previewVersionID);
    } else {
      await this.version.importOneJSON(
        {
          sourceVersion: importData.version,
          sourceDiagrams: Object.values(vfFile.diagrams),
          sourceVersionOverride: { _id: previewVersionID, creatorID: userID },
        },
        { flush: false }
      );

      await this.project.patchOne(project.id, { previewVersion: previewVersionID }, { flush: false });

      await this.mongoEntityManager.flush();
    }

    await this.assistant.importCMSResources(importData);

    return previewVersionID;
  }
}
