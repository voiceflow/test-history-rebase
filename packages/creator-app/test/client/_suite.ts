import { Adapters } from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';
import { SinonStub } from 'sinon';

import { createSuite } from '@/../test/_suite';
import fetch, * as Fetch from '@/client/fetch';

export default createSuite((utils) => ({
  ...utils,

  stubAdapter: <T extends Adapters.AnyBidirectionalAdapter>(adapter: T, method: keyof T, factory: () => any = generate.object): [any, SinonStub] => {
    const transformed: any = factory();
    const adapterStub = utils.stub(adapter, method).returns(transformed);

    return [transformed, adapterStub];
  },

  stubFetch: (client: keyof Pick<typeof Fetch, 'api' | 'apiV2'>, method: keyof typeof fetch = 'get') => {
    return (method ? utils.stub(Fetch[client], method) : utils.stub(Fetch, client)).resolves();
  },
}));
