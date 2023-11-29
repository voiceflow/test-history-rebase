/* eslint-disable max-params */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { BackupEntity, BackupORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import dayjs from 'dayjs';

import { AssistantService } from '@/assistant/assistant.service';
import { EntitySerializer, MutableService } from '@/common';
import { FileService } from '@/file/file.service';
import { UploadType } from '@/file/types';
import { ProjectService } from '@/project/project.service';
import { VFFile } from '@/utils/vffile.interface';
import { VersionService } from '@/version/version.service';

@Injectable()
export class BackupService extends MutableService<BackupORM> {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    @Inject(BackupORM) protected readonly orm: BackupORM,
    @Inject(FileService) private readonly file: FileService,
    @Inject(ProjectService) private readonly project: ProjectService,
    @Inject(VersionService) private readonly version: VersionService,
    @Inject(LoguxService) protected readonly logux: LoguxService,
    @Inject(EntitySerializer) protected readonly entitySerializer: EntitySerializer,
    @Inject(HashedIDService) private readonly hashedID: HashedIDService,
    @Inject(AssistantService) private readonly assistant: AssistantService
  ) {
    super();
  }

  /* Create */

  async createOneForUser(userID: number, versionID: string, name: string) {
    const version = await this.version.findOneOrFail(versionID);
    const vffile = await this.assistant.exportJSON({ environmentID: versionID, assistantID: version.projectID.toHexString() });
    const filename = `${versionID}-${dayjs(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.json`;

    await this.file.uploadFile(UploadType.BACKUP, filename, JSON.stringify(vffile));

    return this.createOne({ s3ObjectRef: filename, name, assistantID: vffile.project._id, createdByID: userID });
  }

  findManyForAssistantID(assistantID: string, options: { limit: number; offset: number }) {
    return this.orm.find(
      {
        assistantID,
      },
      { ...options, orderBy: { createdAt: 'DESC' } }
    );
  }

  async downloadBackup(backupID: number) {
    const backup = await this.findOneOrFail(backupID);
    const file = await this.file.downloadFile(UploadType.BACKUP, backup.s3ObjectRef);

    if (!file) {
      throw new Error('File not found');
    }

    return JSON.parse(await file.transformToString()) as VFFile;
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
      }),
      authMeta
    );

    return backup;
  }

  async getBackupFile(s3ObjectRef: string) {
    const file = await this.file.downloadFile(UploadType.BACKUP, s3ObjectRef);

    if (!file) {
      throw new Error('File not found');
    }

    const data = JSON.parse(await file.transformToString()) as VFFile;

    if (Utils.object.isObject(data?.version.prototype) && Utils.object.isObject(data.version.prototype.settings)) {
      delete data.version.prototype.settings.variableStateID;
    }

    return data;
  }

  async restoreBackup(userID: number, backup: BackupEntity, versionID: string) {
    const data = await this.getBackupFile(backup.s3ObjectRef);

    // create backup before restoring
    await this.createOneForUser(userID, versionID, 'Automatic before restore');

    await this.version.replaceOne(versionID, {
      sourceVersion: data.version,
      sourceDiagrams: Object.values(data.diagrams),
    });
  }

  async previewBackup(backupID: number, userID: number) {
    const backup = await this.findOneOrFail(backupID);
    const [vffile, project] = await Promise.all([this.getBackupFile(backup.s3ObjectRef), this.project.findOneOrFail(backup.assistantID)]);

    if (project.previewVersion) {
      await this.version.replaceOne(project.previewVersion.toString(), {
        sourceVersion: vffile.version,
        sourceDiagrams: Object.values(vffile.diagrams),
      });

      return project.previewVersion.toString();
    }

    const { version } = await this.version.importOneJSON({
      sourceVersion: vffile.version,
      sourceDiagrams: Object.values(vffile.diagrams),
      sourceVersionOverride: { creatorID: userID },
    });

    await this.project.patchOne(project.id, { previewVersion: version.id });

    return version._id.toString();
  }
}
