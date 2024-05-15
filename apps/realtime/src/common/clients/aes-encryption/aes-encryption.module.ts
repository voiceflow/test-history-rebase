import { Global, Module } from '@nestjs/common';

import { AesEncryptionClient } from './aes-encryption.client';
import { ConfigurableModuleClass } from './aes-encryption.module-definition';

@Global()
@Module({
  exports: [AesEncryptionClient],
  providers: [AesEncryptionClient],
})
export class AesEncryptionModule extends ConfigurableModuleClass {}
