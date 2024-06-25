import { Crypto, Utils } from '@voiceflow/common';
import AES from 'crypto-js/aes';

import { COPY_PASTE_KEY } from '@/config';

class Synchronous extends Crypto.Synchronous {
  /**
   * generate key to encrypt data and spilt it to 2 encrypted keys
   */
  generateEncryptedKeys(): [
    firstPartOfEncryptedKey: string,
    secondPartOfEncryptedKey: string,
    keyToEncryptData: string,
  ] {
    const key1 = Utils.id.cuid();
    const key2 = Utils.id.cuid();

    // array used to increase the complexity of debugging, uglify doesn't change object keys
    return [
      this.encrypt([...key1.slice(0, 18), ...key2.slice(18)].reverse().join('')),
      this.encrypt([...key2.slice(0, 18), ...key1.slice(18)].join('')),
      `${key1}-${this.getKey()}-${key2}`,
    ];
  }

  /**
   * decrypt key by encrypted keys
   */
  getKeyToDecrypt(encryptedKey1: string, encryptedKey2: string): string {
    const mixedKey1 = [...this.decrypt(encryptedKey1)].reverse().join('');
    const mixedKey2 = this.decrypt(encryptedKey2);

    const key1 = [...mixedKey1.slice(0, 18), ...mixedKey2.slice(18)].join('');
    const key2 = [...mixedKey2.slice(0, 18), ...mixedKey1.slice(18)].join('');

    return `${key1}-${this.getKey()}-${key2}`;
  }

  /**
   * generate encrypted keys and encrypt data by them
   */
  generateKeysAndEncryptData(data: string): { key1: string; key2: string; data: string } {
    const [key1, key2, keyToEncrypt] = this.generateEncryptedKeys();
    const encryptedData = this.encrypt(data, keyToEncrypt);

    return { key1, key2, data: encryptedData };
  }

  /**
   * decrypt data by encrypted keys
   */
  decryptDataByEncryptedKeys(key1: string, key2: string, data: string): string {
    const keyToDecryptEncrypt = this.getKeyToDecrypt(key1, key2);

    return this.decrypt(data, keyToDecryptEncrypt);
  }
}

export default new Synchronous({ alg: AES, key: COPY_PASTE_KEY });
