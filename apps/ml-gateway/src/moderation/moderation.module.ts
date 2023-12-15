import { Module } from '@nestjs/common';

import { ModerationService } from './moderation.service';

@Module({
  exports: [ModerationService],
  providers: [ModerationService],
})
export class ModerationModule {}
