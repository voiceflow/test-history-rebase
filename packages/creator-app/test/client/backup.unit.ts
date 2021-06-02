import client from '@/client/backup';
import { generate } from '@/utils/testing';

import suite from './_suite';

const PROJECT_ID = generate.id();
const VERSION_ID = generate.id();

suite('Client - Backup', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['restore']);
  });

  describe('restore()', () => {
    it('restore project from backup', async () => {
      const fetch = stubFetch('apiV2', 'post');

      await client.restore(PROJECT_ID, VERSION_ID);

      expect(fetch).to.be.calledWithExactly(`projects/${PROJECT_ID}/restore/${VERSION_ID}`);
    });
  });
});
