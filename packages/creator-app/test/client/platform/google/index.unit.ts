import client from '@/platforms/google/client';

import suite from '../../_suite';

suite('Platform Client - Google', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'modelExport', 'modelImport', 'project', 'publish', 'session', 'version', 'prototype']);
  });
});
