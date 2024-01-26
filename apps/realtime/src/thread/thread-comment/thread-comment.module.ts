import { Module } from '@nestjs/common';
import { ThreadCommentORM, ThreadORM } from '@voiceflow/orm-designer';

import { AssistantModule } from '@/assistant/assistant.module';
import { ProductUpdateModule } from '@/product-update/product-update.module';

import { ThreadSerializer } from '../thread.serializer';
import { ThreadCommentLoguxController } from './thread-comment.logux.controller';
import { ThreadCommentSerializer } from './thread-comment.serializer';
import { ThreadCommentService } from './thread-comment.service';

@Module({
  imports: [ThreadORM.register(), ThreadCommentORM.register(), ProductUpdateModule, AssistantModule],
  exports: [ThreadCommentService, ThreadCommentSerializer],
  providers: [ThreadCommentService, ThreadSerializer, ThreadCommentSerializer],
  controllers: [ThreadCommentLoguxController],
})
export class ThreadCommentModule {}
