import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { VersionService, VFFile } from './version.service';

@Controller('version')
@ApiTags('Version')
export class VersionHTTPController {
  constructor(
    @Inject(VersionService)
    private readonly versionService: VersionService
  ) {}

  @Get(':versionID/export')
  @Authorize.Permissions([Permission.VERSION_PROTOTYPE_READ])
  export(@Param('versionID') versionID: string): Promise<VFFile> {
    return this.versionService.export(versionID);
  }
}
