import { Firestore } from '@google-cloud/firestore';
import { PubSub as GooglePubSub } from '@google-cloud/pubsub';
import { BaseClientMap, Cache, PubSub, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';

import AnalyticsClientInstance from './analytics';
import Billing from './billing';
import MetricsClient, { Metrics } from './metrics';
import OpenAI from './openai';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
  metrics: Metrics;
  openAI: OpenAI;
  firestore: Firestore;
  analytics: AnalyticsClientInstance;
  gcloud: {
    firestore: Firestore;
    pubsub: GooglePubSub;
  };
  billing: Billing;
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
  const googlePubsub = new GooglePubSub(options.config.PUBSUB_PROJECT_KEY ? { projectId: options.config.PUBSUB_PROJECT_KEY } : {});
  const openAI = new OpenAI({ apiKey: options.config.OPENAI_API_KEY, organization: options.config.OPENAI_ORG_ID });
  const billing = new Billing({ ...options, axios });
  const analytics = new AnalyticsClientInstance({ ...options });

  return {
    ...staticClients,
    voiceflowFactory,
    metrics,
    redis,
    pubsub,
    cache,
    openAI,
    billing,
    firestore,
    analytics,
    gcloud: {
      firestore,
      pubsub: googlePubsub,
    },
  };
};

export default buildClients;
