import { Utils } from '@voiceflow/common';
import type { AnySimpleAdapter } from 'bidirectional-adapter';

import type fetch from '@/client/fetch';
import * as Fetch from '@/client/fetch';

import { createSuite } from '../_suite';

export default createSuite((utils) => ({
  ...utils,

  stubAdapter: <T extends AnySimpleAdapter>(
    adapter: T,
    method: keyof T,
    factory: () => any = Utils.generate.object
  ) => {
    const transformed: any = factory();

    const adapterStub = vi.spyOn(adapter, method as any).mockReturnValue(transformed);

    return [transformed, adapterStub] as const;
  },

  stubFetch: (client: keyof Pick<typeof Fetch, 'api' | 'apiV2'>, method: keyof typeof fetch = 'get') => {
    return (method ? vi.spyOn(Fetch[client], method) : vi.spyOn(Fetch, client)).mockResolvedValue(undefined);
  },
}));
