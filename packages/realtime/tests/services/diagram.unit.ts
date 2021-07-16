import { expect } from 'chai';
import sinon from 'sinon';

import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from '@/services/constants';
import DiagramService from '@/services/diagram';

describe('Diagram service unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('canRead', () => {
    it('works', async () => {
      const diagramID = 'testDiagramID';
      const creatorID = 123;

      const services = {};

      const clients = {
        api: {
          diagram: {
            canRead: sinon.stub().resolves(true),
          },
        },
        redis: {
          get: sinon.stub().resolves(null),
          set: sinon.stub(),
        },
      };

      const diagramService = new DiagramService({ services, clients } as any);

      await expect(diagramService.canRead(diagramID, creatorID)).to.eventually.be.true;
      expect(clients.redis.get).to.be.calledWithExactly(`diagrams:${diagramID}:can-read:${creatorID}`);
      expect(clients.redis.set).to.be.calledWithExactly(`diagrams:${diagramID}:can-read:${creatorID}`, 1, DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME);
      expect(clients.api.diagram.canRead).be.calledWithExactly(creatorID, diagramID);
    });
  });
});
