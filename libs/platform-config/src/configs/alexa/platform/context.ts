import * as Base from '@/configs/base';

import type { Account } from './types';

export interface Value extends Base.Context.Value {
  linkAccount: (code: string) => Promise<Account>;

  amazonAuthorize: (options: CodeAuthorizeOptions) => Promise<CodeRequest>;

  amazonInitialize: () => Promise<void>;
}

export const { Context, useContext } = Base.Context.extend<Value>({
  linkAccount: Base.Context.notInjected,

  amazonAuthorize: Base.Context.notInjected,

  amazonInitialize: Base.Context.notInjected,
});
