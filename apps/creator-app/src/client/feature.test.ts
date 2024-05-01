import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import client from './feature';
import * as Fetch from './fetch';

describe('Client - Feature', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['getStatuses']));
  });

  describe('getStatuses()', () => {
    it('should get all feature statuses', async () => {
      const features = Utils.generate.object(3, () => ({ isEnabled: true }));
      const fetch = vi.spyOn(Fetch.api, 'get').mockResolvedValue(features);

      const result = await client.getStatuses();

      expect(result).toEqual(features);
      expect(fetch).toBeCalledWith('features/status');
    });

    it('should get all feature statuses with context', async () => {
      const features = Utils.generate.object();
      const fetch = vi.spyOn(Fetch.api, 'get').mockResolvedValue(features);

      const result = await client.getStatuses({ workspaceID: '123' });

      expect(result).toEqual(features);
      expect(fetch).toBeCalledWith('features/status?workspaceID=123');
    });
  });
});
