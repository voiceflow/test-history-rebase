import client, { LISTS_PATH } from '@/client/lists';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Project List', ({ expect, stubFetch, expectCall }) => {
  describe('update()', () => {
    it('should update project lists', async () => {
      const teamID = generate.id();
      const data: any = generate.object();
      const fetch = stubFetch('patch');

      await expectCall(client.update, teamID, data).toYield();

      expect(fetch).to.be.calledWithExactly(`${LISTS_PATH}/${teamID}/update_board`, data);
    });
  });
});
