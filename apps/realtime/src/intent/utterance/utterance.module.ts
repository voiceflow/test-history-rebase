import { Module } from '@nestjs/common';
import { UtteranceORM } from '@voiceflow/orm-designer';

import { UtteranceLoguxController } from './utterance.logux.controller';
import { UtteranceService } from './utterance.service';

@Module({
  exports: [UtteranceService],
  providers: [UtteranceORM, UtteranceService],
  controllers: [UtteranceLoguxController],
})
export class UtteranceModule {}
