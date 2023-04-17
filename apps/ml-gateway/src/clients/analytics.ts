import { AnalyticsClient } from '@voiceflow/sdk-analytics';
import fetch from 'node-fetch';

import { BaseOptions } from './types';

class AnalyticsClientInstance {
  private client: AnalyticsClient;

  constructor({ config }: BaseOptions) {
    this.client = new AnalyticsClient({ baseURL: config.ANALYTICS_API_ENDPOINT, fetchPonyfill: fetch });
  }

  public trackGenRequest(genType: string, userID: number, details: Record<string, unknown>) {
    this.trackGen('AI_GENERATION_REQUEST', genType, userID, details);
  }

  public trackGenResponse(genType: string, userID: number, details: Record<string, unknown>) {
    this.trackGen('AI_GENERATION_RESPONSE', genType, userID, details);
  }

  public trackGenError(genType: string, userID: number, details: Record<string, unknown>) {
    this.trackGen('AI_GENERATION_ERROR', genType, userID, details);
  }

  private trackGen(eventName: string, genType: string, userID: number, details: Record<string, unknown>) {
    this.client.track({
      name: eventName,
      identity: { userID },
      properties: { reqType: genType, ...details },
    });
  }
}

export default AnalyticsClientInstance;
