declare module 'redux-persist-cookie-storage' {
  import Cookies from 'cookies-js';
  import { Storage } from 'redux-persist';

  export type StorageConfig = {
    setCookieOptions: typeof Cookies['defaults'];
  };

  export const CookieStorage: {
    new (name: typeof Cookies, config: StorageConfig): Storage;
  };
}
