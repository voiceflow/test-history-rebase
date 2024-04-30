import * as Base from '@/configs/base';

import type { Account } from './types';

export interface Value extends Base.Context.Value {
  linkAccount: (code: string) => Promise<Account>;

  googleAuthorize: (scopes: string[]) => Promise<string>;
}

export const { Context, useContext } = Base.Context.extend<Value>({
  linkAccount: Base.Context.notInjected,

  googleAuthorize: Base.Context.notInjected,
});
