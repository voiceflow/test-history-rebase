import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import client from './backup';
import * as Fetch from './fetch';

const PROJECT_ID = Utils.generate.id();
const VERSION_ID = Utils.generate.id();

describe('Client - Backup', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['restore']));
  });

  describe('restore()', () => {
    it('restore project from backup', async () => {
      const fetch = vi.spyOn(Fetch.apiV2, 'post').mockResolvedValue({});

      await client.restore(PROJECT_ID, VERSION_ID);

      expect(fetch).toBeCalledWith(`projects/${PROJECT_ID}/restore/${VERSION_ID}`);
    });
  });
});
