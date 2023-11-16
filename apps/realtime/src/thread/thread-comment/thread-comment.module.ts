import { Module } from '@nestjs/common';
import { ThreadCommentORM, ThreadORM } from '@voiceflow/orm-designer';

import { ProductUpdateModule } from '@/product-update/product-update.module';
import { ProjectModule } from '@/project/project.module';

import { ThreadSerializer } from '../thread.serializer';
import { ThreadCommentLoguxController } from './thread-comment.logux.controller';
import { ThreadCommentSerializer } from './thread-comment.serializer';
import { ThreadCommentService } from './thread-comment.service';

@Module({
  imports: [ThreadORM.register(), ThreadCommentORM.register(), ProductUpdateModule, ProjectModule],
  exports: [ThreadCommentService, ThreadCommentSerializer],
  providers: [ThreadCommentService, ThreadSerializer, ThreadCommentSerializer],
  controllers: [ThreadCommentLoguxController],
})
export class ThreadCommentModule {}
