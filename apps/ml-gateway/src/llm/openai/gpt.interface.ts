export interface AzureBasedGPTConfig {
  AZURE_ENDPOINT: string;
  AZURE_OPENAI_API_KEY: string;
  AZURE_GPT35_DEPLOYMENTS: string;
}

export interface OpenAIGPTConfig {
  OPENAI_API_KEY: string;
  OPENAI_API_ENDPOINT?: string;
}

export type OpenAIConfig = Partial<AzureBasedGPTConfig & OpenAIGPTConfig>;

export const isAzureBasedGPTConfig = (config: OpenAIConfig): config is AzureBasedGPTConfig => {
  return !!config.AZURE_ENDPOINT && !!config.AZURE_OPENAI_API_KEY && !!config.AZURE_GPT35_DEPLOYMENTS;
};

export const isOpenAIGPTConfig = (config: OpenAIConfig): config is OpenAIGPTConfig => {
  return !!config.OPENAI_API_KEY;
};
