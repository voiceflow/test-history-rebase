import { Global, Module } from '@nestjs/common';

import { DateSerializer } from './date.serializer';

@Global()
@Module({
  exports: [DateSerializer],
  providers: [DateSerializer],
})
export class SerializerModule {}
