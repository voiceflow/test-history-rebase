import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import cuid from 'cuid';

import { COPY_PASTE_KEY } from '@/config';

const privateKeySymbol = Symbol('private-key');

class Synchronous {
  constructor({ alg, privateKey }) {
    this.alg = alg;

    // private field
    this[privateKeySymbol] = privateKey;
  }

  /**
   * encrypt data
   *
   * @param {string} data
   * @param {string} key
   * @returns {string}
   */
  encrypt(data, key = this[privateKeySymbol]) {
    return this.alg.encrypt(data, key).toString();
  }

  /**
   * decrypt data
   *
   * @param {string} data
   * @param {string} key
   * @returns {string}
   */
  decrypt(data, key = this[privateKeySymbol]) {
    return this.alg.decrypt(data, key).toString(Utf8);
  }

  /**
   * generate key to encrypt data and spilt it to 2 encrypted keys
   *
   * @returns {[string, string, string]} [firstPartOfEncryptedKey, secondPartOfEncryptedKey, keyToEncryptData]
   */
  generateEncryptedKeys() {
    const key1 = cuid();
    const key2 = cuid();

    // array used to increase the complexity of debugging, uglify doesn't change object keys
    return [
      this.encrypt([...key1.slice(0, 18), ...key2.slice(18)].reverse().join('')),
      this.encrypt([...key2.slice(0, 18), ...key1.slice(18)].join('')),
      `${key1}-${this[privateKeySymbol]}-${key2}`,
    ];
  }

  /**
   * decrypt key by encrypted keys
   * @param {string} encryptedKey1
   * @param {string} encryptedKey2
   * @returns {string}
   */
  getKeyToDecrypt(encryptedKey1, encryptedKey2) {
    const mixedKey1 = [...this.decrypt(encryptedKey1)].reverse().join('');
    const mixedKey2 = this.decrypt(encryptedKey2);

    const key1 = [...mixedKey1.slice(0, 18), ...mixedKey2.slice(18)].join('');
    const key2 = [...mixedKey2.slice(0, 18), ...mixedKey1.slice(18)].join('');

    return `${key1}-${this[privateKeySymbol]}-${key2}`;
  }

  /**
   * generate encrypted keys and encrypt data by them
   *
   * @param {string} data
   * @returns {{key1: string, key2: string, data: string}}
   */
  generateKeysAndEncryptData(data) {
    const [key1, key2, keyToEncrypt] = this.generateEncryptedKeys();
    const encryptedData = this.encrypt(data, keyToEncrypt);

    return { key1, key2, data: encryptedData };
  }

  /**
   * decrypt data by encrypted keys
   *
   * @param {string} key1
   * @param {string} key2
   * @param {string} data
   * @returns {string}
   */
  decryptDataByEncryptedKeys(key1, key2, data) {
    const keyToDecryptEncrypt = this.getKeyToDecrypt(key1, key2);
    return this.decrypt(data, keyToDecryptEncrypt);
  }
}

export default new Synchronous({ alg: AES, privateKey: COPY_PASTE_KEY });
