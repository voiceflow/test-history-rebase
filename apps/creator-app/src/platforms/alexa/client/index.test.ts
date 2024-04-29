import client from '@/platforms/alexa/client';

import suite from '../../_suite';

suite('Platform Client - Alexa', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), [
      'export',
      'modelExport',
      'modelImport',
      'project',
      'publish',
      'session',
      'version',
      'prototype',
      'handlers',
    ]);
  });
});
