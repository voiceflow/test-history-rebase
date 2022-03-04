import client from '@/platforms/general/client/project';

import suite from '../../_suite';

suite('Platform Client - General - Project', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['copy']);
  });
});
