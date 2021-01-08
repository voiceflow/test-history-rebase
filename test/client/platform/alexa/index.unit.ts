import client from '@/client/platforms/alexa';

import suite from '../../_suite';

suite('Platform Client - Alexa', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'project', 'publish', 'session', 'version', 'prototype', 'prototypeV2', 'handlers']);
  });
});
