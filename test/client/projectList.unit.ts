import projectListAdapter from '@/client/adapters/projectList';
import client, { TEAM_PATH } from '@/client/projectList';
import { generate } from '@/utils/testing';

import suite from './_suite';

const WORKSPACE_ID = generate.id();

suite('Client - Project List', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['update', 'find']);
  });

  describe('update()', () => {
    it('should update project lists', async () => {
      const lists: any[] = generate.array();
      const [dbLists, mapToDB] = stubAdapter(projectListAdapter, 'mapToDB', generate.array);
      const fetch = stubFetch('api', 'patch');

      await client.update(WORKSPACE_ID, lists);

      expect(fetch).to.be.calledWithExactly(`${TEAM_PATH}/${WORKSPACE_ID}/update_board`, { boards: dbLists });
      expect(mapToDB).to.be.calledWithExactly(lists);
    });
  });

  describe('find()', () => {
    it('should find project lists', async () => {
      const dbLists = generate.array();
      const fetch = stubFetch('api', 'get').resolves({ boards: dbLists });
      const [lists, mapFromDB] = stubAdapter(projectListAdapter, 'mapFromDB', generate.array);

      const result = await client.find(WORKSPACE_ID);

      expect(result).to.eq(lists);
      expect(fetch).to.be.calledWithExactly(`${TEAM_PATH}/${WORKSPACE_ID}/boards`);
      expect(mapFromDB).to.be.calledWithExactly(dbLists);
    });
  });
});
