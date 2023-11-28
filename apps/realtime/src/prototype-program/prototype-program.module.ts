import { Module } from '@nestjs/common';
import { PrototypeProgramORM } from '@voiceflow/orm-designer';

import { SerializerModule } from '@/common';

import { PrototypeProgramService } from './prototype-program.service';
import { PrototypeProgramPrivateHTTPController } from './prototype-program-private.http.controller';

@Module({
  imports: [PrototypeProgramORM.register(), SerializerModule],
  exports: [PrototypeProgramService],
  providers: [PrototypeProgramService],
  controllers: [PrototypeProgramPrivateHTTPController],
})
export class PrototypeProgramModule {}
