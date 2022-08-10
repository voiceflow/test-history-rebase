import { Utils } from '@voiceflow/common';
import { Adapters } from '@voiceflow/realtime-sdk';

import client, { COMMENTING_PATH } from '@/client/thread';

import suite from './_suite';

const PROJECT_ID = Utils.generate.id();

suite('Client - Thread', ({ expectMembers, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['find', 'get', 'create', 'update']);
  });

  describe('find()', () => {
    it('should find all project threads', async () => {
      const dbThreads = Utils.generate.array(3, Utils.generate.object);
      const fetch = stubFetch('api', 'get').mockResolvedValue({ threads: dbThreads });
      const [threads, mapThreadsFromDB] = stubAdapter(Adapters.threadAdapter, 'mapFromDB', () => Utils.generate.array(3, Utils.generate.object));

      expect(await client.find(PROJECT_ID)).toEqual(threads);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/threads`);
      expect(mapThreadsFromDB).toBeCalledWith(dbThreads);
    });
  });

  describe('get()', () => {
    it('should get a thread by ID', async () => {
      const dbThread = Utils.generate.object();
      const threadID = Utils.generate.id();
      const fetch = stubFetch('api', 'get').mockResolvedValue({ thread: dbThread });
      const [thread, threadFromDB] = stubAdapter(Adapters.threadAdapter, 'fromDB', Utils.generate.object);

      expect(await client.get(PROJECT_ID, threadID)).toEqual(thread);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`);
      expect(threadFromDB).toBeCalledWith(dbThread);
    });
  });

  describe('create()', () => {
    it('should create a new thread', async () => {
      const dbThread = Utils.generate.object();
      const data: any = Utils.generate.object();
      const fetch = stubFetch('api', 'post').mockResolvedValue(dbThread);
      const [thread, threadFromDB] = stubAdapter(Adapters.threadAdapter, 'fromDB', Utils.generate.object);
      const [dbData, threadToDB] = stubAdapter(Adapters.threadAdapter, 'toDB', Utils.generate.object);

      expect(await client.create(PROJECT_ID, data)).toEqual(thread);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/threads`, dbData);
      expect(threadFromDB).toBeCalledWith(dbThread);
      expect(threadToDB).toBeCalledWith(data);
    });
  });

  describe('update()', () => {
    it('should update an existing thread', async () => {
      const dbThread = Utils.generate.object();
      const data: any = Utils.generate.object();
      const threadID = Utils.generate.id();
      const fetch = stubFetch('api', 'put').mockResolvedValue(dbThread);
      const [dbData, threadToDB] = stubAdapter(Adapters.threadAdapter, 'toDB', () => ({
        resolved: true,
        deleted: false,
        node_id: Utils.generate.id(),
        position: Utils.generate.array(2, Utils.generate.number),
      }));

      await client.update(PROJECT_ID, threadID, data);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`, dbData);
      expect(threadToDB).toBeCalledWith(data);
    });
  });
});
