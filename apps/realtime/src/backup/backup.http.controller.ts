import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Backup, BackupDTO } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';

import { BackupService } from './backup.service';
import { BackupCreateRequest } from './dtos/backup-create.request';
import { BackupDownloadResponse } from './dtos/backup-download.response';
import { BackupFindManyResponse } from './dtos/backup-find-many.response';
import { BackupPreviewResponse } from './dtos/backup-preview.response';

@Controller('/project/:projectID/backup')
@ApiTags('Backup')
export class BackupHTTPController {
  constructor(
    @Inject(BackupService)
    private readonly service: BackupService
  ) {}

  @Get()
  @Authorize.Permissions([Permission.PROJECT_READ])
  @ZodApiResponse({ status: HttpStatus.OK, schema: BackupFindManyResponse })
  async findMany(
    @Param('projectID') projectID: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number
  ): Promise<BackupFindManyResponse> {
    return this.service.findManyForAssistantID(projectID, { limit, offset }).then((backups) => ({ data: this.service.mapToJSON(backups) }));
  }

  @Post()
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiBody({ schema: BackupCreateRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: BackupDTO })
  createOne(
    @UserID() creatorID: number,
    @Body(new ZodValidationPipe(BackupCreateRequest)) { versionID, name }: BackupCreateRequest
  ): Promise<Backup> {
    return this.service.createOneForUser(creatorID, versionID, name).then((backup) => this.service.toJSON(backup));
  }

  @Delete(':backupID')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.OK })
  deleteOne(@Param('backupID') backupID: number) {
    return this.service.deleteOne(backupID);
  }

  @Get(':backupID/download')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.OK, schema: BackupDownloadResponse })
  async downloadOne(@Param('backupID') backupID: number): Promise<BackupDownloadResponse> {
    const vfFile = await this.service.downloadBackup(backupID);

    return {
      data: vfFile,
    };
  }

  @Post(':backupID/restore')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: BackupDTO })
  restoreOne(@Param('backupID') backupID: number, @Query('clientID') clientID: string, @UserID() userID: number): Promise<Backup> {
    return this.service.restoreBackupAndEjectUsers({ clientID, userID }, backupID).then((backup) => this.service.toJSON(backup));
  }

  @Post(':backupID/preview')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.OK, schema: BackupPreviewResponse })
  async previewOne(@Param('backupID') backupID: number, @UserID() userID: number): Promise<BackupPreviewResponse> {
    const versionID = await this.service.previewBackup(userID, backupID);

    return {
      versionID,
    };
  }
}
