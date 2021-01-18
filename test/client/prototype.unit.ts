import client, { LEGACY_TESTING_PATH } from '@/client/prototype';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Prototype', ({ expect, stubFetch }) => {
  it('have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['interact', 'getSpeakAudio', 'getLegacyInfo']);
  });

  describe('getSpeakAudio()', () => {
    it('render SSML as audio', async () => {
      const ssml = generate.string();
      const voice = generate.string();
      const fetch = stubFetch('api', 'post');

      await client.getSpeakAudio({ ssml, voice });

      expect(fetch).to.be.calledWithExactly(`${LEGACY_TESTING_PATH}/speak`, { ssml, voice });
    });
  });
});
