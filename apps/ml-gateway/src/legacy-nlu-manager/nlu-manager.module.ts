import { Module } from '@nestjs/common';

import { ConfigurationService } from './configuration.service';
import { GoogleCloudService } from './google-cloud.service';
import { InteractionService } from './interaction.service';
import { NLUManagerHTTPController } from './nlu-manager-public.http.controller';

@Module({
  providers: [ConfigurationService, InteractionService, GoogleCloudService],
  controllers: [NLUManagerHTTPController],
})
export class NLUManagerModule {}
