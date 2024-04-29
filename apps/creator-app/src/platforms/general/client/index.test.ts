import client from '@/platforms/general/client';

import suite from '../../_suite';

suite('Platform Client - General', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), [
      'export',
      'modelExport',
      'modelImport',
      'project',
      'publish',
      'version',
      'prototype',
      'tts',
    ]);
  });
});
