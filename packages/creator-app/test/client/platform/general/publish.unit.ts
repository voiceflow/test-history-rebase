import createClient from '@/platforms/general/client/publish';

import suite from '../../_suite';

const client = createClient();

suite('Platform Client - General - Publish', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['run', 'cancel', 'getStatus', 'updateStage']);
  });
});
