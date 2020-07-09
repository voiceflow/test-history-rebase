import projectListAdapter from '@/client/adapters/projectList';
import client, { TEAM_PATH } from '@/client/projectList';
import { generate } from '@/utils/testing';

import suite from './_suite';

const WORKSPACE_ID = generate.id();

suite('Client - Project List', ({ expect, stubFetch, stubAdapter, expectCall }) => {
  describe('update()', () => {
    it('should update project lists', async () => {
      const lists: any[] = generate.array();
      const [dbLists, mapToDB] = stubAdapter(projectListAdapter, 'mapToDB', generate.array);
      const fetch = stubFetch('patch');

      await expectCall(client.update, WORKSPACE_ID, lists).toYield();

      expect(fetch).to.be.calledWithExactly(`${TEAM_PATH}/${WORKSPACE_ID}/update_board`, { boards: dbLists });
      expect(mapToDB).to.be.calledWithExactly(lists);
    });
  });

  describe('find()', () => {
    it('should find project lists', async () => {
      const dbLists = generate.array();
      const fetch = stubFetch('get').resolves({ boards: dbLists });
      const [lists, mapFromDB] = stubAdapter(projectListAdapter, 'mapFromDB', generate.array);

      await expectCall(client.find, WORKSPACE_ID).toYield(lists);

      expect(fetch).to.be.calledWithExactly(`${TEAM_PATH}/${WORKSPACE_ID}/boards`);
      expect(mapFromDB).to.be.calledWithExactly(dbLists);
    });
  });
});
