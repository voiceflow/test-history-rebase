import { Global, Module } from '@nestjs/common';

import { CacheModule } from '@/cache/cache.module';

import { UserService } from './user.service';

@Global()
@Module({
  imports: [CacheModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
