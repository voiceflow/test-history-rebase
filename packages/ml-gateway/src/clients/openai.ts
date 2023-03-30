import { Configuration, ConfigurationParameters, CreateCompletionRequest, OpenAIApi } from 'openai';
import { Optional } from 'utility-types';

const GPT3_MAX_TOKENS = 2048;

const TIMEOUT = 10000;

enum GPT3_MODELS {
  DaVinci_003 = 'text-davinci-003',
}

class OpenAI {
  private openai: OpenAIApi;

  // to reduce stop completions in GPT3 prompts (empty strings being returned)
  static STOP_INJECT_TOKEN = '\n';

  constructor(config: ConfigurationParameters) {
    const configuration = new Configuration(config);

    this.openai = new OpenAIApi(configuration);
  }

  async createCompletion(
    { model = GPT3_MODELS.DaVinci_003, max_tokens = GPT3_MAX_TOKENS, ...request }: Optional<CreateCompletionRequest, 'model'>,
    tuning: { stopInjection?: boolean } = {}
  ) {
    if (tuning.stopInjection) request.prompt += OpenAI.STOP_INJECT_TOKEN;

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
}

export default OpenAI;
