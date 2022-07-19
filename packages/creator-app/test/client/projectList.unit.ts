import { Utils } from '@voiceflow/common';

import projectListAdapter from '@/client/adapters/projectList';
import client, { TEAM_PATH } from '@/client/projectList';

import suite from './_suite';

const WORKSPACE_ID = Utils.generate.id();

suite('Client - Project List', ({ expectMembers, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['update', 'find']);
  });

  describe('update()', () => {
    it('should update project lists', async () => {
      const lists = Utils.generate.array<any>();
      const [dbLists, mapToDB] = stubAdapter(projectListAdapter, 'mapToDB', Utils.generate.array);
      const fetch = stubFetch('api', 'patch');

      await client.update(WORKSPACE_ID, lists);

      expect(fetch).toBeCalledWith(`${TEAM_PATH}/${WORKSPACE_ID}/update_board`, { boards: dbLists });
      expect(mapToDB).toBeCalledWith(lists);
    });
  });

  describe('find()', () => {
    it('should find project lists', async () => {
      const dbLists = Utils.generate.array();
      const fetch = stubFetch('api', 'get').mockResolvedValue({ boards: dbLists });
      const [lists, mapFromDB] = stubAdapter(projectListAdapter, 'mapFromDB', Utils.generate.array);

      const result = await client.find(WORKSPACE_ID);

      expect(result).toEqual(lists);
      expect(fetch).toBeCalledWith(`${TEAM_PATH}/${WORKSPACE_ID}/boards`);
      expect(mapFromDB).toBeCalledWith(dbLists);
    });
  });
});
