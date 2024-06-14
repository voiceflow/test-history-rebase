import { Module } from '@nestjs/common';
import { AssistantORM, ThreadCommentORM, ThreadORM } from '@voiceflow/orm-designer';

import { ProductUpdateModule } from '@/product-update/product-update.module';

import { ThreadSerializer } from '../thread.serializer';
import { ThreadCommentLoguxController } from './thread-comment.logux.controller';
import { ThreadCommentSerializer } from './thread-comment.serializer';
import { ThreadCommentService } from './thread-comment.service';

@Module({
  imports: [ProductUpdateModule],
  exports: [ThreadCommentService, ThreadCommentSerializer],
  providers: [
    ThreadORM,
    AssistantORM,
    ThreadCommentORM,
    ThreadCommentService,
    ThreadSerializer,
    ThreadCommentSerializer,
  ],
  controllers: [ThreadCommentLoguxController],
})
export class ThreadCommentModule {}
