import { Subscription, Topic } from '@google-cloud/pubsub';
import { Utils } from '@voiceflow/common';
import Chance from 'chance';
import { createNanoEvents } from 'nanoevents';

import logger from '@/logger';
import { ModelConfiguration, ModelFlag, ModelVersionConfiguration, PubSubRequest, PubSubResponse } from '@/models';

import { AbstractControl } from '../control';

export interface TopicWithSubscription {
  topic: Topic;
  subscription: Subscription;
}

export const DEFAULT_REQUEST_TIMEOUT = 60 * 1000;

export const createTopicName = (modelID: string, versionID: string): string => `${modelID}-${versionID}`;

export const createSubscriptionName = (subscriberID: string): string => `ml-gateway-${subscriberID}`;

export const createEventName = (topicName: string, requestID: string): string => `${topicName}:${requestID}`;

export const chooseABTestVersion = (chance: Chance.Chance, versions: ModelVersionConfiguration[]): ModelVersionConfiguration =>
  chance.weighted(
    versions,
    versions.map(({ traffic }) => traffic)
  );

const closeSubscription = (topicName: string, subscription: Subscription): Promise<void> =>
  subscription.close().catch((error) => logger.error({ message: `failed to teardown subscription to topic: ${topicName}`, error }));

class InteractionService extends AbstractControl {
  emitter = createNanoEvents<Record<string, (response: PubSubResponse) => void>>();

  private chance = Chance();

  private cache = new Map<string, TopicWithSubscription>();

  private async initializeTopicClient(subscriberID: string, topicName: string): Promise<TopicWithSubscription> {
    const topic = this.clients.gcloud.pubsub.topic(topicName);

    const [subscription] = await topic.createSubscription(createSubscriptionName(subscriberID));

    // last minute check to avoid replacing a subscription that was created on-demand
    const existingTopic = this.cache.get(topicName);
    if (existingTopic) {
      subscription.close().catch((error) => logger.warn({ message: `failed to cleanup subscription to topic: ${topicName}`, error }));

      return existingTopic;
    }

    subscription.on('message', (message: Partial<PubSubResponse>) => {
      const requestID = message?.requestID ?? null;
      if (!requestID) {
        logger.error(`received a response from topic '${topicName}' without a valid request ID`);
        return;
      }

      this.emitter.emit(createEventName(topicName, requestID), message as PubSubResponse);
    });

    subscription.on('error', (error) => {
      logger.error({ message: `received an error from topic: ${topicName}`, error });
    });

    const result = { topic, subscription };
    this.cache.set(topicName, result);

    return result;
  }

  private async getTopic(subscriberID: string, topicName: string): Promise<Topic> {
    const cached = this.cache.get(topicName);
    if (cached) return cached.topic;

    const { topic } = await this.initializeTopicClient(subscriberID, topicName);

    return topic;
  }

  private createResponseListener<Result>(eventName: string, timeout: number) {
    let stopListening = Utils.functional.noop;

    return new Promise<PubSubResponse<Result>>((resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        stopListening();
        reject(new Error(`response was not sent within timeout of ${timeout / 1000}s`));
      }, timeout);

      stopListening = this.emitter.on(eventName, (response) => {
        clearTimeout(rejectTimeout);
        stopListening();
        resolve(response as PubSubResponse<Result>);
      });
    });
  }

  async synchronizeClients(subscriberID: string, modelConfigs: ModelConfiguration[]): Promise<void> {
    const nextCache = new Map<string, TopicWithSubscription>();
    const { cache } = this;

    const topicNames = modelConfigs.flatMap((modelConfig) =>
      Object.keys(modelConfig.versions).map((versionID) => createTopicName(modelConfig.id, versionID))
    );
    const topicsToCreate = topicNames.reduce<string[]>((acc, topicName) => {
      const cachedTopic = cache.get(topicName);
      if (cachedTopic) {
        nextCache.set(topicName, cachedTopic);
        return acc;
      }

      acc.push(topicName);

      return acc;
    }, []);

    this.cache = nextCache;

    // drop all the persisted clients from the old cache
    Array.from(nextCache.keys()).forEach((topicName) => cache.delete(topicName));

    // create and add all new clients
    await Promise.all(topicsToCreate.map((topicName) => this.initializeTopicClient(subscriberID, topicName)));

    // teardown the expired clients
    await Promise.all(Array.from(cache.entries()).map(([topicName, { subscription }]) => closeSubscription(topicName, subscription)));
  }

  private async sendRequestToTopic<Params, Result>(
    subscriberID: string,
    topicName: string,
    request: PubSubRequest<Params>,
    timeout = DEFAULT_REQUEST_TIMEOUT
  ): Promise<PubSubResponse<Result>> {
    const eventName = createEventName(topicName, request.requestID);
    const topic = await this.getTopic(subscriberID, topicName);

    const [, response] = await Promise.all([topic.publishMessage({ json: request }), this.createResponseListener<Result>(eventName, timeout)]);

    return response;
  }

  private async sendShadowRequestToTopic<Params>(subscriberID: string, topicName: string, request: PubSubRequest<Params>): Promise<void> {
    try {
      const topic = await this.getTopic(subscriberID, topicName);

      await topic.publishMessage({ json: request });
    } catch (error) {
      logger.error({ message: `unable to send shadow traffic to topic: ${topicName}`, error });
    }
  }

  async sendRequest<Params, Result>(
    subscriberID: string,
    modelConfig: ModelConfiguration,
    request: PubSubRequest<Params>,
    timeout = DEFAULT_REQUEST_TIMEOUT
  ): Promise<PubSubResponse<Result>> {
    const versions = Object.values(modelConfig.versions);

    const shadowTrafficVersions = versions.filter(
      (version) => version.flags.includes(ModelFlag.SHADOW) && this.chance.bool({ likelihood: version.traffic })
    );
    const sendShadowTraffic = () =>
      Promise.all(
        shadowTrafficVersions.map(async (version) => {
          const topicName = createTopicName(modelConfig.id, version.id);

          return this.sendShadowRequestToTopic<Params>(subscriberID, topicName, request);
        })
      ).catch(() => logger.error('failed to send shadow traffic'));

    const abTestVersions = versions.filter((version) => version.flags.includes(ModelFlag.AB_TEST));
    if (abTestVersions.length) {
      const version = chooseABTestVersion(this.chance, abTestVersions);
      const topicName = createTopicName(modelConfig.id, version.id);

      const response = await this.sendRequestToTopic<Params, Result>(subscriberID, topicName, request, timeout);
      sendShadowTraffic();

      return response;
    }

    const normalVersion = versions.find((version) => version.flags.includes(ModelFlag.NORMAL));
    if (!normalVersion) {
      throw new Error(`unable to find a valid version of the model: ${modelConfig.id}`);
    }

    const topicName = createTopicName(modelConfig.id, normalVersion.id);

    const response = await this.sendRequestToTopic<Params, Result>(subscriberID, topicName, request, timeout);
    sendShadowTraffic();

    return response;
  }

  async stop(): Promise<void> {
    await Promise.allSettled(Array.from(this.cache.entries()).map(([topicName, { subscription }]) => closeSubscription(topicName, subscription)));
  }
}

export default InteractionService;
