import createClient from '@/client/services/modelExport';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - ModelExport', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['exportBlob']);
  });
});
