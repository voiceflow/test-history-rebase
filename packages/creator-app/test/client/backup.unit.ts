import { Utils } from '@voiceflow/common';

import client from '@/client/backup';

import suite from './_suite';

const PROJECT_ID = Utils.generate.id();
const VERSION_ID = Utils.generate.id();

suite('Client - Backup', ({ stubFetch, expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['restore']);
  });

  describe('restore()', () => {
    it('restore project from backup', async () => {
      const fetch = stubFetch('apiV2', 'post');

      await client.restore(PROJECT_ID, VERSION_ID);

      expect(fetch).toBeCalledWith(`projects/${PROJECT_ID}/restore/${VERSION_ID}`);
    });
  });
});
