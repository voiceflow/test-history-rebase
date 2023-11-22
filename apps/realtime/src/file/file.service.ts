import { DeleteObjectCommand, DeleteObjectOutput, GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import multerS3 from 'multer-s3';

import { MB } from './file.constants';
import type { FileModuleOptions } from './file.interface';
import { MODULE_OPTIONS_TOKEN } from './file.module-definition';
import type { UploadType } from './types';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  public static getFileKey(file: Express.Multer.File): string {
    return `${Date.now().toString()}-${file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w.-]+/g, '')}`;
  }

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: FileModuleOptions,

    @Optional()
    private readonly s3 = new S3Client({
      credentials: {
        accessKeyId: options.accessKeyID,
        secretAccessKey: options.secretAccessKey,
      },
      endpoint: options.endpoint,
      region: options.region,
      forcePathStyle: options.format === 'legacy',
    })
  ) {}

  public getStorage(fileType: UploadType) {
    const bucket = this.options.buckets[fileType];

    return multerS3({
      s3: this.s3,
      acl: 'public-read',
      key: (_req, file, cb) => cb(null, FileService.getFileKey(file)),
      bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
    });
  }

  public getLimits() {
    return { files: 1, fileSize: this.options.defaultMaxFileSizeMB * MB };
  }

  public deleteFile(fileType: UploadType, file: string): Promise<DeleteObjectOutput> {
    const [key] = file.split('/').slice(-1);
    const bucket = this.options.buckets[fileType];
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });

    return this.s3.send(command);
  }

  public async uploadFile(fileType: UploadType, name: string, content: PutObjectCommandInput['Body']) {
    try {
      const bucket = this.options.buckets[fileType];

      const command = new PutObjectCommand({ Bucket: bucket, Key: name, Body: content });

      await this.s3.send(command);
    } catch (error) {
      this.logger.error(error, 'Error uploading file');
      throw error;
    }
  }

  public async downloadFile(fileType: UploadType, key: string) {
    const bucket = this.options.buckets[fileType];

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    try {
      const { Body } = await this.s3.send(command);

      return Body;
    } catch (error) {
      this.logger.error(error, 'Error uploading file');
      throw error;
    }
  }
}
