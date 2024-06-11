import { Global, Module } from '@nestjs/common';

import { CacheModule } from '@/cache/cache.module';

import { UserHTTPController } from './user.http.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [CacheModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserHTTPController],
})
export class UserModule {}
