import { Module } from '@nestjs/common';
import { AssistantORM, CardAttachmentORM, CardButtonORM } from '@voiceflow/orm-designer';

import { CardButtonLoguxController } from './card-button.logux.controller';
import { CardButtonService } from './card-button.service';

@Module({
  exports: [CardButtonService],
  providers: [CardButtonORM, AssistantORM, CardAttachmentORM, CardButtonService],
  controllers: [CardButtonLoguxController],
})
export class CardButtonModule {}
