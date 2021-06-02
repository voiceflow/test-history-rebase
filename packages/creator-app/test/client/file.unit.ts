import client from '@/client/file';

import suite from './_suite';

suite('Client - File', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['uploadAudio', 'uploadImage']);
  });
});
