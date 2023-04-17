import client from '@/platforms/alexa/client/handlers';

import suite from '../../_suite';

suite('Platform Client - Alexa - Handlers', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['getDisplayWithDatasource']);
  });
});
