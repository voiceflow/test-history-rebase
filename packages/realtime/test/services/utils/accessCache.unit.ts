import { expect } from 'chai';
import sinon from 'sinon';

import AccessCache from '@/services/utils/accessCache';

describe('Access cache unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('canRead', () => {
    it('check and update read access cache', async () => {
      const resourceID = 'testDiagramID';
      const creatorID = 123;

      const voiceflowClient = {
        diagram: {
          canRead: sinon.stub().resolves(true),
        },
      };

      const keyValueCacheClient = {
        get: sinon.stub().resolves(null),
        set: sinon.stub(),
      };

      const clients = {
        cache: {
          adapters: {
            booleanAdapter: 'booleanAdapter',
          },
          createSet: sinon.stub(),
          createKeyValue: sinon.stub().returns(keyValueCacheClient),
        },
      };

      const services = {
        voiceflow: {
          getClientByUserID: sinon.stub().resolves(voiceflowClient),
        },
      };

      const cache = new AccessCache('diagram', clients as any, services as any);

      await expect(cache.canRead(creatorID, resourceID)).to.eventually.be.true;
      expect(keyValueCacheClient.get).to.be.calledWithExactly({ resourceID, creatorID });
      expect(keyValueCacheClient.set).to.be.calledWithExactly({ resourceID, creatorID }, true);
      expect(voiceflowClient.diagram.canRead).be.calledWithExactly(creatorID, resourceID);
    });
  });
});
