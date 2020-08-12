import suite from '@/../test/_suite';
import client from '@/client';

suite('Client - Root', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
      'alexaService',
      'session',
      'analytics',
      'diagram',
      'user',
      'workspace',
      'projectList',
      'project',
      'prototype',
      'clipboard',
      'skill',
      'display',
      'product',
      'comment',
      'thread',
      'file',
      'template',
      'onboarding',
      'feature',
      'zapier',
      'socket',
      'canvasExport',
    ]);
  });
});
