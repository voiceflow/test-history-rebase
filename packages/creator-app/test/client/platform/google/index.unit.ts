import client from '@/platforms/google/client';

import suite from '../../_suite';

suite('Platform Client - Google', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['export', 'modelExport', 'modelImport', 'project', 'publish', 'session', 'version', 'prototype']);
  });
});
