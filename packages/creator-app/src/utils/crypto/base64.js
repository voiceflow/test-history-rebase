import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

export default class CustomBase64 {
  static encode(data) {
    return Base64.stringify(Utf8.parse(data));
  }

  static encodeObject(data) {
    return CustomBase64.encode(JSON.stringify(data));
  }

  static decode(data) {
    return Utf8.stringify(Base64.parse(data));
  }

  static decodeObject(data) {
    return JSON.parse(CustomBase64.decode(data));
  }
}
