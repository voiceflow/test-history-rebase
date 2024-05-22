/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { BackupObject, BackupORM, DatabaseTarget, ProjectObject } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import dayjs from 'dayjs';

import { AssistantService } from '@/assistant/assistant.service';
import { AssistantImportDataDTO } from '@/assistant/dtos/assistant-import-data.dto';
import { MutableService } from '@/common';
import { EnvironmentService } from '@/environment/environment.service';
import { FileService } from '@/file/file.service';
import { UploadType } from '@/file/types';
import { ProjectService } from '@/project/project.service';

@Injectable()
export class BackupService extends MutableService<BackupORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

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
      const vfFile = await this.assistant.exportJSON({
        userID,
        backup: true,
        environmentID: versionID,
      });

      const filename = `${versionID}-${dayjs(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.json`;

      await this.file.uploadFile(UploadType.BACKUP, filename, JSON.stringify(vfFile));

      return this.createOne({ s3ObjectRef: filename, name, assistantID: vfFile.project._id, createdByID: userID });
    });
  }

  findManyForAssistantID(assistantID: string, options: { limit: number; offset: number }) {
    return this.orm.find({ assistantID }, { ...options, orderBy: { createdAt: 'desc' } });
  }

  async findOneByName(assistantID: string, name: string) {
    const backups = await this.orm.find({ name, assistantID }, { limit: 1 });

    if (!backups.length) {
      return null;
    }

    return backups[0];
  }

  async downloadBackup(backupID: number): Promise<AssistantImportDataDTO> {
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

    return AssistantImportDataDTO.parse(JSON.parse(await file.transformToString()));
  }

  private async findOrCreateAssistantForProject(userID: number, project: ProjectObject) {
    let assistant = await this.assistant.findOne(project._id.toJSON());

    if (!assistant) {
      assistant = await this.assistant.createOne({
        id: project._id.toJSON(),
        name: project.name,
        updatedByID: userID,
        workspaceID: project.teamID,
        activeEnvironmentID: project.devVersion!.toJSON(),
      });
    }

    return assistant;
  }

  private async restoreBackup(userID: number, backup: BackupObject, versionID: string) {
    const [vfFile, project] = await Promise.all([
      this.getBackupFile(backup.s3ObjectRef),
      this.project.findOneOrFail(backup.assistantID),
    ]);

    // create backup before restoring
    await this.createOneForUser(userID, versionID, 'Automatic before restore');

    await this.environment.deleteOne(versionID);

    const assistant = await this.findOrCreateAssistantForProject(userID, project);

    const importData = this.assistant.migrateAndPrepareEnvironmentImportJSON({
      data: vfFile,
      userID,
      backup: true,
      project,
      assistant,
      environmentID: versionID,
    });

    await this.environment.importJSON({
      data: importData,
      userID,
      assistantID: backup.assistantID,
      environmentID: versionID,
    });
  }

  async previewBackup(userID: number, backupID: number) {
    return this.postgresEM.transactional(async () => {
      const backup = await this.findOneOrFail(backupID);
      const [vfFile, project] = await Promise.all([
        this.getBackupFile(backup.s3ObjectRef),
        this.project.findOneOrFail(backup.assistantID),
      ]);

      const previewVersionID = project.previewVersion?.toJSON() ?? new ObjectId().toString();

      if (project.previewVersion) {
        await this.environment.deleteOne(project.previewVersion.toJSON());
      }

      const assistant = await this.findOrCreateAssistantForProject(userID, project);

      const importData = this.assistant.migrateAndPrepareEnvironmentImportJSON({
        data: vfFile,
        userID,
        backup: true,
        project,
        assistant,
        environmentID: previewVersionID,
      });

      await this.environment.importJSON({
        data: importData,
        userID,
        assistantID: backup.assistantID,
        environmentID: previewVersionID,
      });

      if (!project.previewVersion) {
        await this.project.patchOne(project._id.toJSON(), { previewVersion: new ObjectId(previewVersionID) });
      }

      return previewVersionID;
    });
  }
}
