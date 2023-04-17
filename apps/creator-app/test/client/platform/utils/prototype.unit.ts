import createClient from '@/client/services/prototype';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - Prototype', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['renderSync']);
  });
});
