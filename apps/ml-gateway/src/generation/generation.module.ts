import { Module } from '@nestjs/common';

import { CompletionModule } from '@/completion/completion.module';

import { GenerationService } from './generation.service';
import { GenerationPublicHTTPController } from './generation-public.http.controller';

@Module({
  imports: [CompletionModule],
  exports: [GenerationService],
  providers: [GenerationService],
  controllers: [GenerationPublicHTTPController],
})
export class GenerationModule {}
