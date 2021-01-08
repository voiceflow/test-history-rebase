import client from '@/client/platforms/alexa/handlers';

import suite from '../../_suite';

suite('Platform Client - Alexa - Handlers', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getDisplayWithDatasource']);
  });
});
