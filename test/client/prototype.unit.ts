import client from '@/client/prototype';

import suite from './_suite';

suite('Client - Prototype', ({ expect }) => {
  it('have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['interact', 'getLegacyInfo']);
  });
});
