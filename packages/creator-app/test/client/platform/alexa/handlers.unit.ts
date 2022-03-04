import client from '@/platforms/alexa/client/handlers';

import suite from '../../_suite';

suite('Platform Client - Alexa - Handlers', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getDisplayWithDatasource']);
  });
});
