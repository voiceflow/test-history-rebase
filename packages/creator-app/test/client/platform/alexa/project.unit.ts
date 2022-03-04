import client from '@/platforms/alexa/client/project';

import suite from '../../_suite';

suite('Platform Client - Alexa - Project', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
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
