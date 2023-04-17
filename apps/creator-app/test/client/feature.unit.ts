import { Utils } from '@voiceflow/common';

import client from '@/client/feature';

import suite from './_suite';

suite('Client - Feature', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['getStatuses']);
  });

  describe('getStatuses()', () => {
    it('should get all feature statuses', async () => {
      const features = Utils.generate.object();
      const fetch = stubFetch('api').mockResolvedValue(features);

      const result = await client.getStatuses();

      expect(result).toEqual(features);
      expect(fetch).toBeCalledWith('features/status');
    });

    it('should get all feature statuses with context', async () => {
      const features = Utils.generate.object();
      const fetch = stubFetch('api').mockResolvedValue(features);

      const result = await client.getStatuses({ workspaceID: '123' });

      expect(result).toEqual(features);
      expect(fetch).toBeCalledWith('features/status?workspaceID=123');
    });
  });
});
