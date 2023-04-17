import createClient from '@/client/services/version';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - Version', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['updateSettings', 'updatePublishing']);
  });
});
