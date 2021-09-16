import client from '@/client';

import suite from './_suite';

suite('Client - Root', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
      'api',
      'platform',
      'backup',
      'canvasExport',
      'comment',
      'feature',
      'file',
      'integrations',
      'projectList',
      'prototype',
      'session',
      'socket',
      'sso',
      'user',
      'template',
      'thread',
      'workspace',
      'transcript',
      'reportTags',
      'realtime',
    ]);
  });
});
