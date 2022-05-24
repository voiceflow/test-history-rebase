import createClient from '@/client/services/prototype';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - Prototype', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['run', 'cancel', 'getStatus', 'renderSync']);
  });
});
