import client from '@/client/canvasExport';

import suite from './_suite';

suite('Client - Canvas Export', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['toPNG', 'toPDF']);
  });
});
