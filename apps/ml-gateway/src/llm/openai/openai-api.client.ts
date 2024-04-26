import { Configuration, OpenAIApi } from '@voiceflow/openai';

import type { OpenAIConfig } from './gpt.interface';
import { isAzureBasedGPTConfig, isOpenAIGPTConfig } from './gpt.interface';

export class OpenAIClient {
  openAIClient?: OpenAIApi;

  azureClient?: OpenAIApi;

  constructor(config: OpenAIConfig, azureDeployment?: string) {
    if (isAzureBasedGPTConfig(config) && azureDeployment) {
      // remove trailing slash
      const endpoint = config.AZURE_ENDPOINT.replace(/\/$/, '');

      this.azureClient = new OpenAIApi(
        new Configuration({
          azure: {
            endpoint,
            apiKey: config.AZURE_OPENAI_API_KEY,
            deploymentName: azureDeployment,
          },
        })
      );
    }

    if (isOpenAIGPTConfig(config)) {
      this.openAIClient = new OpenAIApi(
        new Configuration({ apiKey: config.OPENAI_API_KEY, basePath: config.OPENAI_API_ENDPOINT || undefined })
      );
    }

    if (!this.openAIClient && !this.azureClient) {
      throw new Error('OpenAI client not initialized');
    }
  }

  get client(): OpenAIApi {
    // one of them is guaranteed to be initialized, otherwise there would be an error
    return (this.azureClient || this.openAIClient)!;
  }
}
