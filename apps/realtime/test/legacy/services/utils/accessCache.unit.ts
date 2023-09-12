import AccessCache from '@/legacy/services/utils/accessCache';

describe('Access cache unit tests', () => {
  describe('canRead', () => {
    it('check and update read access cache', async () => {
      const resourceID = 'testDiagramID';
      const creatorID = 123;

      const voiceflowClient = {
        diagram: {
          canRead: vi.fn().mockResolvedValue(true),
        },
      };

      const keyValueCacheClient = {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn(),
      };

      const clients = {
        cache: {
          adapters: {
            booleanAdapter: 'booleanAdapter',
          },
          createSet: vi.fn(),
          createKeyValue: vi.fn().mockReturnValue(keyValueCacheClient),
        },
      };

      const services = {
        voiceflow: {
          getClientByUserID: vi.fn().mockResolvedValue(voiceflowClient),
        },
      };

      const cache = new AccessCache('diagram', clients as any, services as any);

      await expect(cache.canRead(creatorID, resourceID)).resolves.toBe(true);
      expect(keyValueCacheClient.get).toBeCalledWith({ resourceID, creatorID });
      expect(keyValueCacheClient.set).toBeCalledWith({ resourceID, creatorID }, true, undefined);
      expect(voiceflowClient.diagram.canRead).toBeCalledWith(creatorID, resourceID);
    });
  });
});
