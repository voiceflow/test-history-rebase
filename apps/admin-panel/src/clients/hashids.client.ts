import BaseHashids from 'hashids/esm/hashids';

import { envClient } from './env.client';

class Hashids extends BaseHashids {
  decode(hash: string): number[] {
    return super.decode(hash) as number[];
  }
}

export const hashidsClient = new Hashids(envClient.get('HASHED_WORKSPACE_ID_SALT'), 10);
