import { OpenAI } from 'openai';

import { isAzureBasedGPTConfig, isOpenAIGPTConfig, OpenAIConfig } from './gpt.interface';

export class OpenAIClient {
  openAIClient?: OpenAI;

  azureClient?: OpenAI;

  constructor(config: OpenAIConfig, azureDeployment?: string) {
    if (isAzureBasedGPTConfig(config) && azureDeployment) {
      // remove trailing slash
      const endpoint = config.AZURE_ENDPOINT.replace(/\/$/, '');

      const apiVersion = '2024-02-01';
      const apiKey = config.AZURE_OPENAI_API_KEY;
      const url = new URL(`openai/deployments/${azureDeployment}`, endpoint);

      this.azureClient = new OpenAI({
        apiKey,
        baseURL: url.href,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': apiKey },
      });
    }

    if (isOpenAIGPTConfig(config)) {
      this.openAIClient = new OpenAI({
        apiKey: config.OPENAI_API_KEY,
        baseURL: config.OPENAI_API_ENDPOINT || undefined,
      });
    }

    if (!this.openAIClient && !this.azureClient) {
      throw new Error(`OpenAI client not initialized`);
    }
  }

  get client(): OpenAI {
    // one of them is guaranteed to be initialized, otherwise there would be an error
    return (this.azureClient || this.openAIClient)!;
  }
}
