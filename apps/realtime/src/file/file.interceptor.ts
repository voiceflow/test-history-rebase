import type { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import { Inject, mixin, Optional } from '@nestjs/common';
import type { MulterModuleOptions } from '@nestjs/platform-express/multer';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils.js';
import { BadRequestException } from '@voiceflow/exception';
import multer from 'multer';
import type { Observable } from 'rxjs';

import { FileService } from './file.service';
import type { UploadType } from './types';

interface FileInterceptorOptions extends MulterModuleOptions {
  fileType: UploadType;
}

export function FileInterceptor(fieldName: string, localOptions: FileInterceptorOptions): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private multer: multer.Multer;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      private readonly options: MulterModuleOptions = {},

      @Inject(FileService)
      private readonly fileService: FileService
    ) {
      this.multer = multer({
        limits: this.fileService.getLimits(),
        storage: this.fileService.getStorage(localOptions.fileType),
        ...this.options,
        ...localOptions,
      } as multer.Options);
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) => {
        this.multer.single(fieldName)(ctx.getRequest(), ctx.getResponse(), (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }

          if (!ctx.getRequest().file) {
            throw new BadRequestException('Missing image');
          }

          return resolve();
        });
      });

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
