import client from '@/platforms/general/client/project';

import suite from '../../_suite';

suite('Platform Client - General - Project', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['copy']);
  });
});
