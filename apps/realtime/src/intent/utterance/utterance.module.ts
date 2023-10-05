import { Module } from '@nestjs/common';
import { UtteranceORM } from '@voiceflow/orm-designer';

import { UtteranceLoguxController } from './utterance.logux.controller';
import { UtteranceService } from './utterance.service';

@Module({
  imports: [UtteranceORM.register()],
  exports: [UtteranceService],
  providers: [UtteranceService],
  controllers: [UtteranceLoguxController],
})
export class UtteranceModule {}
