import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Backup, BackupDTO } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';

import { EntitySerializer } from '@/common';

import { BackupService } from './backup.service';
import { CreateBackupRequest } from './dtos/create-backup-request.dto';
import { Download } from './dtos/download.dto';
import { FindManyBackupResponse } from './dtos/find-many-backup-response.dto';
import { PreviewBackupResponse } from './dtos/preview-backup-response.dto';

@Controller('/project/:projectID/backup')
@ApiTags('Backup')
export class BackupHTTPController {
  constructor(
    @Inject(BackupService)
    private readonly service: BackupService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Get()
  @Authorize.Permissions([Permission.PROJECT_READ])
  @ZodApiResponse({ status: HttpStatus.OK, schema: FindManyBackupResponse })
  async findMany(
    @Param('projectID') projectID: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number
  ): Promise<FindManyBackupResponse> {
    return this.service.findManyForAssistantID(projectID, { limit, offset }).then((result) => ({ data: this.entitySerializer.iterable(result) }));
  }

  @Post()
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiBody({ schema: CreateBackupRequest })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: BackupDTO })
  createOne(
    @UserID() creatorID: number,
    @Body(new ZodValidationPipe(CreateBackupRequest)) { versionID, name }: CreateBackupRequest
  ): Promise<Backup> {
    return this.service.createOneForUser(creatorID, versionID, name).then(this.entitySerializer.serialize);
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
  @ZodApiResponse({ status: HttpStatus.OK, schema: Download })
  async downloadOne(@Param('backupID') backupID: number) {
    const download = await this.service.downloadBackup(backupID);

    return {
      data: download,
    };
  }

  @Post(':backupID/restore')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: BackupDTO })
  restoreOne(@Param('backupID') backupID: number, @Query('clientID') clientID: string, @UserID() userID: number): Promise<Backup> {
    return this.service.restoreBackupAndEjectUsers({ clientID, userID }, backupID).then(this.entitySerializer.serialize);
  }

  @Post(':backupID/preview')
  @ApiParam({ name: 'projectID', type: 'string' })
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ZodApiResponse({ status: HttpStatus.OK, schema: PreviewBackupResponse })
  async previewOne(@Param('backupID') backupID: number, @UserID() userID: number): Promise<PreviewBackupResponse> {
    const versionID = await this.service.previewBackup(backupID, userID);

    return {
      versionID,
    };
  }
}
