import { Body, Controller, Get, HttpStatus, Inject, Param, ParseArrayPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';

import { EntitySerializer } from '@/common';
import { MulterFile } from '@/file/types';

import { FunctionExportIDs, FunctionExportQuery } from './dtos/function-export-json.query';
import { FunctionExportJSONResponse } from './dtos/function-export-json.response';
import { FunctionImportJSONResponse } from './dtos/function-import-json.response';
import { FunctionImportJSONDataDTO } from './dtos/function-import-json-data.dto';
import { FunctionService } from './function.service';

@Controller('function')
@ApiTags('Function')
export class FunctionPublicHTTPController {
  constructor(
    @Inject(FunctionService)
    private readonly service: FunctionService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Get('export-json/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiQuery({ schema: FunctionExportQuery })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: FunctionExportJSONResponse })
  exportJSON(
    @Param('environmentID') environmentID: string,
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }), FunctionExportIDs) ids: string[]
  ): Promise<FunctionExportJSONResponse> {
    return this.service.exportJSON(environmentID, ids);
  }

  @Post('import-file/:environmentID')
  @Authorize.Permissions<Request<{ environmentID: string }>>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.environmentID,
    kind: 'version',
  }))
  @ApiBody({
    schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, clientID: { type: 'string' } } },
  })
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: FunctionImportJSONResponse })
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @UserID() userID: number,
    @Param('environmentID') environmentID: string,
    @UploadedFile() file: MulterFile,
    @Body() { clientID }: { clientID?: string }
  ): Promise<FunctionImportJSONResponse> {
    const data = FunctionImportJSONDataDTO.parse(JSON.parse(file.buffer.toString('utf8')));

    const { duplicatedFunctions, functions } = await this.service.importJSONAndBroadcast({ data, userID, clientID, environmentID });

    return {
      functions: this.entitySerializer.iterable(functions),
      duplicatedFunctions,
    };
  }
}
