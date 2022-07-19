import client from '@/platforms/google/client/project';

import suite from '../../_suite';

suite('Platform Client - Google - Project', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['copy', 'getGoogleProjects']);
  });
});
