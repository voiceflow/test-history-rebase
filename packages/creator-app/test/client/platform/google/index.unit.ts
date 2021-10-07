import client from '@/client/platforms/google';

import suite from '../../_suite';

suite('Platform Client - Google', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'modelExport', 'project', 'publish', 'publishV2', 'session', 'version', 'prototype']);
  });
});
