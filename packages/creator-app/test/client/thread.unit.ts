import { Utils } from '@voiceflow/common';

import threadAdapter from '@/client/adapters/thread';
import client, { COMMENTING_PATH } from '@/client/thread';

import suite from './_suite';

const PROJECT_ID = Utils.generate.id();

suite('Client - Thread', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['find', 'get', 'create', 'update']);
  });

  describe('find()', () => {
    it('should find all project threads', async () => {
      const dbThreads = Utils.generate.array(3, Utils.generate.object);
      const fetch = stubFetch('api', 'get').resolves({ threads: dbThreads });
      const [threads, mapThreadsFromDB] = stubAdapter(threadAdapter, 'mapFromDB', () => Utils.generate.array(3, Utils.generate.object));

      await expect(client.find(PROJECT_ID)).to.eventually.eq(threads);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads`);
      expect(mapThreadsFromDB).to.be.calledWithExactly(dbThreads);
    });
  });

  describe('get()', () => {
    it('should get a thread by ID', async () => {
      const dbThread = Utils.generate.object();
      const threadID = Utils.generate.id();
      const fetch = stubFetch('api', 'get').resolves({ thread: dbThread });
      const [thread, threadFromDB] = stubAdapter(threadAdapter, 'fromDB', Utils.generate.object);

      await expect(client.get(PROJECT_ID, threadID)).to.eventually.eq(thread);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`);
      expect(threadFromDB).to.be.calledWithExactly(dbThread);
    });
  });

  describe('create()', () => {
    it('should create a new thread', async () => {
      const dbThread = Utils.generate.object();
      const data: any = Utils.generate.object();
      const fetch = stubFetch('api', 'post').resolves(dbThread);
      const [thread, threadFromDB] = stubAdapter(threadAdapter, 'fromDB', Utils.generate.object);
      const [dbData, threadToDB] = stubAdapter(threadAdapter, 'toDB', Utils.generate.object);

      await expect(client.create(PROJECT_ID, data)).to.eventually.eq(thread);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads`, dbData);
      expect(threadFromDB).to.be.calledWithExactly(dbThread);
      expect(threadToDB).to.be.calledWithExactly(data);
    });
  });

  describe('update()', () => {
    it('should update an existing thread', async () => {
      const dbThread = Utils.generate.object();
      const data: any = Utils.generate.object();
      const threadID = Utils.generate.id();
      const fetch = stubFetch('api', 'put').resolves(dbThread);
      const [dbData, threadToDB] = stubAdapter(threadAdapter, 'toDB', () => ({
        resolved: true,
        deleted: false,
        node_id: Utils.generate.id(),
        position: Utils.generate.array(2, Utils.generate.number),
      }));

      await client.update(PROJECT_ID, threadID, data);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`, dbData);
      expect(threadToDB).to.be.calledWithExactly(data);
    });
  });
});
