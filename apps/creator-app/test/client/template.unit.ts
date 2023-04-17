import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';

import client from '@/client/template';

import suite from './_suite';

suite('Client - Template', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['getPlatformTemplate']);
  });

  describe('getPlatformTemplate()', () => {
    it('get a platform template', async () => {
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(Platform.Constants.PlatformType.GOOGLE);

      expect(fetch).toBeCalledWith(`templates/${Platform.Constants.PlatformType.GOOGLE}`, { query: { tag: 'default' } });
    });

    it('get a platform template with a specific tag', async () => {
      const tag = Utils.generate.string();
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(Platform.Constants.PlatformType.ALEXA, tag);

      expect(fetch).toBeCalledWith(`templates/${Platform.Constants.PlatformType.ALEXA}`, { query: { tag } });
    });
  });
});
