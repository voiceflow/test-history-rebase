import client from '@/client';
import { Thunk } from '@/store/types';

const checkSharedProtoPassword =
  (versionID: string, password: string): Thunk<boolean> =>
  async () => {
    try {
      const result = await client.api.version.checkPrototypeSharedLogin(versionID, { password });
      return !!result.versionID;
    } catch {
      return false;
    }
  };

export default checkSharedProtoPassword;
