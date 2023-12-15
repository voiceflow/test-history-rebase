import type { ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard as BaseThrottlerGuard } from '@nestjs/throttler';
import type { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';
import type { Request } from 'express';

@Injectable()
export class ThrottlerGuard extends BaseThrottlerGuard {
  private readonly logger: Logger = new Logger(ThrottlerGuard.name);

  protected async getTracker(req: Request): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // ignore throttling for logux requests
    if (context.switchToRpc().getContext<{ isLoguxTransport?: () => boolean }>().isLoguxTransport?.()) return true;

    return super.shouldSkip(context);
  }

  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail) {
    this.logger.warn(await this.getErrorMessage(context, throttlerLimitDetail));

    return super.throwThrottlingException(context, throttlerLimitDetail);
  }
}
