import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { describe, expect, it, vi } from 'vitest';

import * as Fetch from '@/client/fetch';
import client from '@/client/template';

describe('Client - Template', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['getPlatformTemplate']));
  });

  describe('getPlatformTemplate()', () => {
    it('get a platform template', async () => {
      const fetch = vi.spyOn(Fetch.apiV2, 'get').mockResolvedValue({});

      await client.getPlatformTemplate(Platform.Constants.PlatformType.GOOGLE);

      expect(fetch).toBeCalledWith(`templates/${Platform.Constants.PlatformType.GOOGLE}`, {
        query: { tag: 'default' },
      });
    });

    it('get a platform template with a specific tag', async () => {
      const tag = Utils.generate.string();
      const fetch = vi.spyOn(Fetch.apiV2, 'get').mockResolvedValue({});

      await client.getPlatformTemplate(Platform.Constants.PlatformType.ALEXA, tag);

      expect(fetch).toBeCalledWith(`templates/${Platform.Constants.PlatformType.ALEXA}`, { query: { tag } });
    });
  });
});
