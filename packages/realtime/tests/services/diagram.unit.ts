import { expect } from 'chai';
import sinon from 'sinon';

import DiagramService from '@/services/diagram';

describe('Diagram service unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('canRead', () => {
    it('works', async () => {
      const diagramID = 'testDiagramID';
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

      const diagramService = new DiagramService({ services, clients } as any);

      await expect(diagramService.canRead(creatorID, diagramID)).to.eventually.be.true;
      expect(keyValueCacheClient.get).to.be.calledWithExactly({ diagramID, creatorID });
      expect(keyValueCacheClient.set).to.be.calledWithExactly({ diagramID, creatorID }, true);
      expect(voiceflowClient.diagram.canRead).be.calledWithExactly(creatorID, diagramID);
    });
  });
});
