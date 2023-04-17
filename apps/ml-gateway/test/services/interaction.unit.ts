/* eslint-disable dot-notation */
import { expect } from 'chai';
import sinon from 'sinon';

import InteractionService from '@/services/interaction';

describe('Services | Interaction', () => {
  describe('initializeTopicClient()', () => {
    it('creates a unique response subscription per topic', async () => {
      const subscriberID = 'subscriberID';
      const requestTopicName = 'topicName_req';
      const responseTopicName = 'topicName_resp';
      const responseSubscription = {
        on: sinon.spy(),
      };
      const responseTopic = {
        createSubscription: sinon.stub().returns([responseSubscription]),
      };
      const expectedResult = {
        requestTopic: {},
        responseTopic,
        responseSubscription,
      };
      const clients = {
        gcloud: {
          pubsub: {
            topic: sinon //
              .stub()
              .onFirstCall()
              .returns({})
              .onSecondCall()
              .returns(responseTopic),
          },
        },
      };

      const service = new InteractionService({ clients } as any);

      await expect(service['initializeTopicClient'](subscriberID, requestTopicName)).to.eventually.eql(expectedResult);

      expect(service['cache'].get(requestTopicName)).to.eql(expectedResult);
      expect(clients.gcloud.pubsub.topic) //
        .to.be.calledWithExactly(requestTopicName)
        .and.calledWithExactly(responseTopicName);
      expect(responseTopic.createSubscription).to.be.calledWithExactly(`ml-gateway-${responseTopicName}-${subscriberID}`);
    });
  });
});
