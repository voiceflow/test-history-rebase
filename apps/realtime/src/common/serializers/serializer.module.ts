import { Global, Module } from '@nestjs/common';

import { DateSerializer } from './date.serializer';
import { EntitySerializer } from './entity.serializer';

@Global()
@Module({
  exports: [EntitySerializer, DateSerializer],
  providers: [EntitySerializer, DateSerializer],
})
export class SerializerModule {}
