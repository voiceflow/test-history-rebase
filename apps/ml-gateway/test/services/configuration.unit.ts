/* eslint-disable dot-notation */
import { Crypto } from '@voiceflow/common';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfigurationService from '@/services/configuration';

describe('Services | Configuration', () => {
  describe('start()', () => {
    it('synchronizes topic clients based off of the configured firestore collection', async () => {
      const clientID = 'abc:123';
      const fooTopic = { topic: 'foo' };
      const barTopic = { topic: 'bar' };
      const config = {
        FIRESTORE_MODEL_COLLECTION: 'firestore_collection',
      };
      const clients = {
        gcloud: {
          firestore: {
            collection: sinon.stub().returns({
              onSnapshot: (callback: (snapshot: FirebaseFirestore.QuerySnapshot) => void) =>
                callback({
                  docs: [
                    { id: fooTopic.topic, data: () => fooTopic },
                    { id: barTopic.topic, data: () => barTopic },
                  ],
                } as any),
            }),
          },
        },
      };
      const services = {
        interaction: {
          synchronizeClients: sinon.stub().resolves(),
        },
      };

      const service = new ConfigurationService({ config, clients, services } as any);

      await service.start(clientID);

      expect(service['cache'].size).to.eq(2);
      expect(service['cache'].get(fooTopic.topic)).to.eq(fooTopic);
      expect(service['cache'].get(barTopic.topic)).to.eq(barTopic);
      expect(clients.gcloud.firestore.collection).to.be.calledWithExactly(config.FIRESTORE_MODEL_COLLECTION);
      expect(services.interaction.synchronizeClients).to.be.calledWithExactly(Crypto.Base64.encode(clientID), [fooTopic, barTopic]);
    });
  });
});
