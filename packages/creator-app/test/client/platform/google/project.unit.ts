import client from '@/client/platforms/google/project';

import suite from '../../_suite';

suite('Platform Client - Google - Project', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['copy', 'getDialogFlowESProjects', 'getGoogleProjects']);
  });
});
