import client from '@/client/platforms/general/project';

import suite from '../../_suite';

suite('Platform Client - General - Project', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['copy']);
  });
});
