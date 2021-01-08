import createClient from '@/client/platforms/utils/session';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

suite('Platform Client - Utils - Session', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getAccount', 'linkAccount', 'unlinkAccount']);
  });
});
