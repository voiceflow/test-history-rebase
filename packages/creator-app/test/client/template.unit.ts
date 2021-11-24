import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';

import client from '@/client/template';

import suite from './_suite';

suite('Client - Template', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['getPlatformTemplate']);
  });

  describe('getPlatformTemplate()', () => {
    it('get a platform template', async () => {
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(Constants.PlatformType.GOOGLE);

      expect(fetch).to.be.calledWithExactly(`templates/${Constants.PlatformType.GOOGLE}`, { query: { tag: 'default' } });
    });

    it('get a platform template with a specific tag', async () => {
      const tag = Utils.generate.string();
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(Constants.PlatformType.ALEXA, tag);

      expect(fetch).to.be.calledWithExactly(`templates/${Constants.PlatformType.ALEXA}`, { query: { tag } });
    });
  });
});
