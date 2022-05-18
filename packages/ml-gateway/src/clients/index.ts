import { Firestore } from '@google-cloud/firestore';
import { PubSub as GooglePubSub } from '@google-cloud/pubsub';
import { BaseClientMap, Cache, PubSub, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';

import MetricsClient, { Metrics } from './metrics';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
  metrics: Metrics;
  gcloud: {
    firestore: Firestore;
    pubsub: GooglePubSub;
  };
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient(options);
  const pubsub = new PubSub({ ...options, redis });
  const cache = new Cache({ redis });
  const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });
  const metrics = MetricsClient(options);
  const firestore = new Firestore();
  const googlePubsub = new GooglePubSub({ projectId: options.config.PUBSUB_PROJECT_KEY });

  return {
    ...staticClients,
    voiceflowFactory,
    metrics,
    redis,
    pubsub,
    cache,
    gcloud: {
      firestore,
      pubsub: googlePubsub,
    },
  };
};

export default buildClients;
