import client from '@/client/platforms/general';

import suite from '../../_suite';

suite('Platform Client - General', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'modelExport', 'project', 'publish', 'version', 'prototype', 'nlp', 'tts']);
  });
});
