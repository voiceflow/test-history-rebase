import createClient from '@/client/services/version';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - Version', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['updateVersion', 'updateSettings', 'updatePublishing', 'updatePlatformData']);
  });
});
