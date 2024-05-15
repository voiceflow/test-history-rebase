import { ConfigurableModuleBuilder } from '@nestjs/common';

import { AesEncryptionModuleOptions } from './aes-encryption.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: AES_ENCRYPTION_TOKEN_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AesEncryptionModuleOptions>().build();
