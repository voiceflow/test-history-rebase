import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client/template';

import suite from './_suite';

suite('Client - Template', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['getPlatformTemplate']);
  });

  describe('getPlatformTemplate()', () => {
    it('get a platform template', async () => {
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(VoiceflowConstants.PlatformType.GOOGLE);

      expect(fetch).toBeCalledWith(`templates/${VoiceflowConstants.PlatformType.GOOGLE}`, { query: { tag: 'default' } });
    });

    it('get a platform template with a specific tag', async () => {
      const tag = Utils.generate.string();
      const fetch = stubFetch('apiV2', 'get');

      await client.getPlatformTemplate(VoiceflowConstants.PlatformType.ALEXA, tag);

      expect(fetch).toBeCalledWith(`templates/${VoiceflowConstants.PlatformType.ALEXA}`, { query: { tag } });
    });
  });
});
