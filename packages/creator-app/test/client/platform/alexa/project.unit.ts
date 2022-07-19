import client from '@/platforms/alexa/client/project';

import suite from '../../_suite';

suite('Platform Client - Alexa - Project', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), [
      'copy',
      'updateSelectedVendor',
      'updateVendorSkillID',
      'copyProduct',
      'createProduct',
      'updateProduct',
      'deleteProduct',
    ]);
  });
});
