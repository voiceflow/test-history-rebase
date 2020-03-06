import suite from '@/../test/_suite';
import client from '@/client';

suite('Client - Root', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
      'session',
      'analytics',
      'diagram',
      'user',
      'workspace',
      'list',
      'project',
      'testing',
      'clipboard',
      'skill',
      'display',
      'socket',
      'product',
      'file',
      'template',
      'onboarding',
      'feature',
    ]);
  });
});
