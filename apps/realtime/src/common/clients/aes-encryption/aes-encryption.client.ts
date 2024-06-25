import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';

import type { AesEncryptionModuleOptions } from './aes-encryption.interface';
import { AES_ENCRYPTION_TOKEN_MODULE_OPTIONS_TOKEN } from './aes-encryption.module-definition';

@Injectable()
export class AesEncryptionClient {
  private aesSecretKey = this.options.aesSecretKey;

  private encryptionMethod = this.options.encryptionMethod;

  constructor(
    @Inject(AES_ENCRYPTION_TOKEN_MODULE_OPTIONS_TOKEN)
    private options: AesEncryptionModuleOptions
  ) {}

  encrypt(text: string, useIvString = true): string {
    const iv: Buffer = useIvString ? crypto.randomBytes(16) : Buffer.alloc(16);

    const cipher = crypto.createCipheriv(this.encryptionMethod, Buffer.from(this.aesSecretKey), iv);

    // Enable auto-padding with PKCS#7
    cipher.setAutoPadding(true);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    if (useIvString) {
      return `${iv.toString('hex')}:${encrypted}`;
    }

    return encrypted;
  }

  decrypt(encrypted: string): string {
    let iv: Buffer;
    let encryptedText: string;

    // Check if the encrypted string contains a colon (:) indicating the presence of IV
    if (encrypted.includes(':')) {
      const [ivString, ...rest] = encrypted.split(':');
      iv = Buffer.from(ivString, 'hex');
      encryptedText = rest.join(':');
    } else {
      // If there is no colon, assume an empty IV
      iv = Buffer.alloc(16);
      encryptedText = encrypted;
    }

    const decipher = crypto.createDecipheriv(this.encryptionMethod, Buffer.from(this.aesSecretKey), iv);

    // Enable auto-padding with PKCS#7
    decipher.setAutoPadding(true);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
