import { Global, Module } from '@nestjs/common';

import { DateSerializer } from './date.serializer';
import { EntitySerializer } from './entity.serializer';

@Global()
@Module({
  providers: [EntitySerializer, DateSerializer],
  exports: [EntitySerializer, DateSerializer],
})
export class SerializerModule {}
