import client from '@/client/template';
import { PlatformType } from '@/constants';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Template', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getPlatformTemplate']);
  });

  describe('getPlatformTemplate()', () => {
    it('get a platform template', async () => {
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(PlatformType.GOOGLE);

      expect(fetch).to.be.calledWithExactly(`templates/${PlatformType.GOOGLE}`, { query: { tag: 'default' } });
    });

    it('get a platform template with a specific tag', async () => {
      const tag = generate.string();
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(PlatformType.ALEXA, tag);

      expect(fetch).to.be.calledWithExactly(`templates/${PlatformType.ALEXA}`, { query: { tag } });
    });
  });
});
