import { Message, Subscription, Topic } from '@google-cloud/pubsub';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import Chance from 'chance';
import { createNanoEvents } from 'nanoevents';

import { ModelConfiguration, ModelFlag, ModelVersionConfiguration } from './configuration.interface';
import { GoogleCloudService } from './google-cloud.service';
import { BasePubSubPayload, InternalPubSubRequest } from './pubsub.interface';

export interface TopicWithSubscription {
  requestTopic: Topic;
  responseTopic: Topic;
  responseSubscription: Subscription;
}

export const DEFAULT_REQUEST_TIMEOUT = 60 * 4 * 1000;

export const createSubscriptionName = (topicName: string, subscriberID: string): string =>
  `ml-gateway-${topicName}-${subscriberID}`;

export const createEventName = (topicName: string, reqGUID: string): string => `${topicName}.${reqGUID}`;

export const chooseABTestVersion = (
  chance: Chance.Chance,
  versions: ModelVersionConfiguration[]
): ModelVersionConfiguration =>
  chance.weighted(
    versions,
    versions.map(({ traffic }) => traffic)
  );

@Injectable()
export class InteractionService {
  private logger = new Logger(InteractionService.name);

  emitter = createNanoEvents<Record<string, (response: BasePubSubPayload) => void>>();

  DEFAULT_REQUEST_TIMEOUT = DEFAULT_REQUEST_TIMEOUT;

  private chance = Chance();

  private cache = new Map<string, TopicWithSubscription>();

  deleteSubscription = (topicName: string, subscription: Subscription) =>
    subscription
      .delete()
      .catch((error) => this.logger.error({ message: `failed to delete subscription to topic: ${topicName}`, error }));

  closeSubscription = (topicName: string, subscription: Subscription): Promise<void> =>
    subscription
      .close()
      .catch((error) =>
        this.logger.error({ message: `failed to teardown the expired subscription for topic: ${topicName}`, error })
      );

  constructor(
    @Inject(GoogleCloudService)
    private gcloud: GoogleCloudService
  ) {}

  private static internalRequest(
    { reqGUID, ...request }: BasePubSubPayload,
    mode: ModelFlag,
    modeUUID: string = Utils.id.cuid()
  ): InternalPubSubRequest {
    return { reqGUID, mode, modeUUID, ...request };
  }

  private async initializeTopicClient(subscriberID: string, topicName: string): Promise<TopicWithSubscription> {
    const responseTopicName = topicName.replace('_req', '_resp');

    const requestTopic = this.gcloud.pubsub.topic(topicName);
    const responseTopic = this.gcloud.pubsub.topic(responseTopicName);

    const [responseSubscription] = await responseTopic.createSubscription(
      createSubscriptionName(responseTopicName, subscriberID)
    );

    // last minute check to avoid replacing a subscription that was created on-demand
    const existingResponseTopic = this.cache.get(responseTopicName);
    if (existingResponseTopic) {
      responseSubscription
        .close()
        .catch((error) =>
          this.logger.warn({ message: `failed to cleanup subscription to topic: ${responseTopicName}`, error })
        );

      return existingResponseTopic;
    }

    responseSubscription.on('message', (message: Message) => {
      message.ack();

      const data: BasePubSubPayload = JSON.parse(message.data.toString());

      if (!data?.reqGUID) {
        this.logger.warn(`received a response from topic '${topicName}' without a valid request ID`);
        return;
      }

      this.emitter.emit(createEventName(topicName, data.reqGUID), data);
    });

    responseSubscription.on('error', (error) => {
      this.logger.error({ message: `received an error from topic: ${topicName}`, error });
    });

    const result: TopicWithSubscription = { requestTopic, responseTopic, responseSubscription };

    this.cache.set(topicName, result);

    return result;
  }

  private async getRequestTopic(subscriberID: string, requestTopicName: string): Promise<Topic> {
    const cached = this.cache.get(requestTopicName);
    if (cached) return cached.requestTopic;

    const { requestTopic } = await this.initializeTopicClient(subscriberID, requestTopicName);

    return requestTopic;
  }

  private createResponseListener<Result extends BasePubSubPayload>(eventName: string, timeout: number) {
    let stopListening = Utils.functional.noop;
    let rejected = false;

    return new Promise<Result>((resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        rejected = true;

        stopListening();

        reject(new Error(`response was not sent within timeout of ${timeout / 1000}s`));
      }, timeout);

      stopListening = this.emitter.on(eventName, (response) => {
        if (rejected) return;

        clearTimeout(rejectTimeout);
        stopListening();

        resolve(response as Result);
      });
    });
  }

  async synchronizeClients(subscriberID: string, modelConfigs: ModelConfiguration[]): Promise<void> {
    const nextCache = new Map<string, TopicWithSubscription>();
    const { cache } = this;

    const topics = modelConfigs.flatMap((modelConfig) => Object.values(modelConfig).map((version) => version.topic));
    const topicsToCreate = topics.reduce<string[]>((acc, topicName) => {
      const cachedTopic = cache.get(topicName);
      if (cachedTopic) {
        nextCache.set(topicName, cachedTopic);
        return acc;
      }

      if (topicName) {
        acc.push(topicName);
      }

      return acc;
    }, []);

    this.cache = nextCache;

    // drop all the persisted clients from the old cache
    Array.from(nextCache.keys()).forEach((topicName) => cache.delete(topicName));

    if (topicsToCreate.length) {
      this.logger.log(`creating topic clients: ${topicsToCreate.join(', ')}`);

      // create and add all new clients
      await Promise.all(topicsToCreate.map((topicName) => this.initializeTopicClient(subscriberID, topicName)));
    }

    if (cache.size) {
      this.logger.log(`removing topic clients ${Array.from(cache.keys()).join(', ')}`);

      // teardown the expired clients
      await Promise.all(
        Array.from(cache.entries()).map(([topicName, { responseSubscription }]) =>
          this.closeSubscription(topicName, responseSubscription)
        )
      );
    }
  }

  private async sendRequestToTopic<Result extends BasePubSubPayload>(
    subscriberID: string,
    topicName: string,
    request: InternalPubSubRequest,
    timeout = DEFAULT_REQUEST_TIMEOUT
  ): Promise<Result> {
    const eventName = createEventName(topicName, request.reqGUID);
    const topic = await this.getRequestTopic(subscriberID, topicName);

    const [, response] = await Promise.all([
      topic.publishMessage({ json: request }),
      this.createResponseListener<Result>(eventName, timeout),
    ]);

    return response;
  }

  private async sendShadowRequestToTopic(
    subscriberID: string,
    topicName: string,
    request: BasePubSubPayload
  ): Promise<void> {
    try {
      const topic = await this.getRequestTopic(subscriberID, topicName);

      await topic.publishMessage({ json: InteractionService.internalRequest(request, ModelFlag.SHADOW) });
    } catch (error) {
      this.logger.error({ message: `unable to send shadow traffic to topic: ${topicName}`, error });
    }
  }

  async sendRequest<Request extends BasePubSubPayload, Result extends BasePubSubPayload>(
    subscriberID: string,
    modelConfig: ModelConfiguration,
    request: Request,
    timeout = DEFAULT_REQUEST_TIMEOUT,
    appendRequest = true
  ): Promise<Result> {
    const versions = Object.values(modelConfig);

    const shadowTrafficVersions = versions.filter(
      (version) => version.trafficType === ModelFlag.SHADOW && this.chance.bool({ likelihood: version.traffic })
    );

    const sendShadowTraffic = () =>
      Promise.all(
        shadowTrafficVersions.map(async (version) =>
          this.sendShadowRequestToTopic(subscriberID, version.topic, request)
        )
      ).catch(() => this.logger.error('failed to send shadow traffic'));

    const abTestVersions = versions.filter((version) => version.trafficType === ModelFlag.AB_TEST);

    if (abTestVersions.length) {
      const version = chooseABTestVersion(this.chance, abTestVersions);

      const response = await this.sendRequestToTopic<Result>(
        subscriberID,
        version.topic,
        InteractionService.internalRequest(request, ModelFlag.AB_TEST),
        timeout
      );
      sendShadowTraffic();

      return response;
    }

    const normalVersion = versions.find((version) => version.trafficType === ModelFlag.NORMAL);

    if (!normalVersion) {
      throw new Error('unable to find a valid version of the model');
    }

    const response = await this.sendRequestToTopic<Result>(
      subscriberID,
      normalVersion.topic,
      appendRequest ? InteractionService.internalRequest(request, ModelFlag.NORMAL) : (request as any),
      timeout
    );
    sendShadowTraffic();

    return response;
  }

  async stop(): Promise<void> {
    await Promise.allSettled(
      Array.from(this.cache.entries()).map(([topicName, { responseSubscription }]) =>
        this.deleteSubscription(topicName, responseSubscription)
      )
    );
  }
}
