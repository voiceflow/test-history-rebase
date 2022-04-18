import client from '@/platforms/general/client';

import suite from '../../_suite';

suite('Platform Client - General', ({ expect }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['export', 'modelExport', 'modelImport', 'project', 'publish', 'version', 'prototype', 'nlp', 'tts']);
  });
});
