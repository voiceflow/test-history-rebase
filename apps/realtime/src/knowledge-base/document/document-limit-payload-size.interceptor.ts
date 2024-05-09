import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { BadRequestException } from '@voiceflow/exception';
import type { Observable } from 'rxjs';

@Injectable()
export class PayloadSizeLimitInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // approximate calculation, not very reliable check
    const bodySizeInBytes = Buffer.byteLength(JSON.stringify(req.body));
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

    if (bodySizeInBytes > maxSizeInBytes) {
      throw new BadRequestException(`Request body size exceeds the limit: 10 MB`);
    }

    return next.handle();
  }
}
