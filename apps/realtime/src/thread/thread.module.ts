import { Module } from '@nestjs/common';
import { ThreadCommentORM, ThreadORM } from '@voiceflow/orm-designer';

import { ThreadLoguxController } from './thread.logux.controller';
import { ThreadSerializer } from './thread.serializer';
import { ThreadService } from './thread.service';
import { ThreadCommentModule } from './thread-comment/thread-comment.module';

@Module({
  imports: [ThreadORM.register(), ThreadCommentORM.register(), ThreadCommentModule],
  exports: [ThreadService, ThreadSerializer],
  providers: [ThreadService, ThreadSerializer],
  controllers: [ThreadLoguxController],
})
export class ThreadModule {}
