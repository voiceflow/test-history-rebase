import client from '@/client/thread';

import suite from './_suite';

suite('Client - Thread', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['find', 'get', 'create', 'update']);
  });
});
