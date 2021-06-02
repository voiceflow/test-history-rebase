import createClient from '@/client/platforms/general/publish';

import suite from '../../_suite';

const client = createClient();

suite('Platform Client - General - Publish', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['run', 'cancel', 'getStatus', 'updateStage']);
  });
});
