import { Body, Controller, HttpStatus, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';

import { FileInterceptor } from '@/file/file.interceptor';
import type { MulterFile } from '@/file/types';
import { UploadType } from '@/file/types';

import { UploadAssistantImageResponse } from './dtos/upload-assistant-image-response.dto';
import { UploadResponse } from './dtos/upload-response.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadHTTPController {
  constructor(
    @Inject(UploadService)
    private readonly upload: UploadService
  ) {}

  @Post('image')
  @Authorize.Permissions([Permission.SELF_USER_UPDATE])
  @ApiBody({
    schema: { type: 'object', required: ['image'], properties: { image: { type: 'string', format: 'binary' } } },
  })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: UploadResponse })
  @UseInterceptors(FileInterceptor('image', { fileType: UploadType.IMAGE }))
  image(@UploadedFile() file: MulterFile): UploadResponse {
    return {
      url: file.location,
    };
  }

  @Post(':projectID/image')
  @Authorize.Permissions([Permission.PROJECT_UPDATE])
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: { image: { type: 'string', format: 'binary' }, clientID: { type: 'string' } },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ZodApiResponse({ status: HttpStatus.CREATED, schema: UploadAssistantImageResponse })
  @UseInterceptors(FileInterceptor('image', { fileType: UploadType.IMAGE }))
  async assistantImage(
    @UserID() userID: number,
    @UploadedFile() file: MulterFile,
    @Param('projectID') projectID: string,
    @Body() { clientID }: { clientID?: string }
  ): Promise<UploadAssistantImageResponse> {
    const attachment = await this.upload.createImageAttachment({
      url: file.location,
      name: file.originalname,
      userID,
      clientID,
      assistantID: projectID,
    });

    return {
      url: file.location,
      attachmentID: attachment.id,
    };
  }
}
