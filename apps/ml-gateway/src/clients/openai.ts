import { AIGPTModel } from '@voiceflow/dtos';
import { Configuration, ConfigurationParameters, CreateChatCompletionRequest, CreateCompletionRequest, OpenAIApi } from 'openai';
import { Optional } from 'utility-types';

const MAX_TOKENS = 2048;

const TIMEOUT = 30000;

class OpenAI {
  private openai: OpenAIApi;

  // to reduce stop completions in GPT3 prompts (empty strings being returned)
  static STOP_INJECT_TOKEN = '\n';

  constructor(config: ConfigurationParameters) {
    const configuration = new Configuration(config);

    this.openai = new OpenAIApi(configuration);
  }

  async createCompletion(
    { model = AIGPTModel.DaVinci_003, max_tokens = MAX_TOKENS, ...request }: Optional<CreateCompletionRequest, 'model'>,
    tuning: { stopInjection?: boolean } = {}
  ) {
    if (typeof request.prompt !== 'string') {
      throw new Error(`prompt must be a string: ${request.prompt}`);
    }

    // check if a string ends with whitespace or a colon
    if (tuning.stopInjection && !/\s|:$/.test(request.prompt)) {
      request.prompt += OpenAI.STOP_INJECT_TOKEN;
    }

    const response = await this.openai.createCompletion({ model, max_tokens, ...request }, { timeout: TIMEOUT });

    const text = response?.data.choices[0]?.text?.trim();
    const tokensUsed = response?.data.usage?.total_tokens;

    if (!text) {
      throw response;
    }

    return {
      text,
      tokensUsed,
    };
  }

  async createChatCompletion({
    model = AIGPTModel.GPT_3_5_turbo,
    max_tokens = MAX_TOKENS,
    ...request
  }: Optional<CreateChatCompletionRequest, 'model'>) {
    const response = await this.openai.createChatCompletion({ model, max_tokens, ...request }, { timeout: TIMEOUT });

    const text = response?.data?.choices[0]?.message?.content;
    const tokensUsed = response?.data.usage?.total_tokens;

    if (!text) {
      throw response;
    }

    return {
      text,
      tokensUsed,
    };
  }
}

export default OpenAI;
