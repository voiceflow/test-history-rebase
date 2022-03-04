import client from '@/platforms/alexa/client';

import suite from '../../_suite';

suite('Platform Client - Alexa', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'modelExport', 'project', 'publish', 'session', 'version', 'prototype', 'handlers']);
  });
});
