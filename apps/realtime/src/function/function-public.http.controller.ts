import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { EntitySerializer } from '@/common';

import { FunctionExportImportDataDTO } from './dtos/function-export-import-data.dto';
import { FunctionExportJSONQuery } from './dtos/function-export-json.query';
import { FunctionExportJSONResponse } from './dtos/function-export-json.response';
import { FunctionImportJSONResponse } from './dtos/function-import-json.response';
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
  @Authorize.Permissions<Request<{ assistantID: string }>>([Permission.PROJECT_READ], (request) => ({
    id: request.params.assistantID,
    kind: 'version',
  }))
  @ApiParam({ name: 'environmentID', type: 'string' })
  @ZodApiQuery({ schema: FunctionExportJSONQuery })
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: FunctionExportJSONResponse })
  exportJSON(
    @Param('environmentID') environmentID: string,
    @Query(new ZodValidationPipe(FunctionExportJSONQuery)) query: FunctionExportJSONQuery
  ): Promise<FunctionExportJSONResponse> {
    return this.service.exportJSON(environmentID, query.ids);
  }

  @Post('import-file/:environmentID')
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
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
    @UploadedFile() file: Express.Multer.File,
    @Body() { clientID }: { clientID?: string }
  ): Promise<FunctionImportJSONResponse> {
    const data = FunctionExportImportDataDTO.parse(JSON.parse(file.buffer.toString('utf8')));

    const functions = await this.service.importJSONAndBroadcast({ data, userID, clientID, environmentID });

    return {
      functions: this.entitySerializer.iterable(functions),
    };
  }
}
