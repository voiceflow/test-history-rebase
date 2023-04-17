import { mlService } from '@/client/fetch';

import {
  EntityPromptGenRequest,
  EntityPromptGenResponse,
  EntityValuesGenRequest,
  EntityValuesGenResponse,
  GenerativeResponseRequest,
  GenerativeResponseResponse,
  ResponseGenRequest,
  ResponseGenResponse,
  UtteranceGenRequest,
  UtteranceGenResponse,
} from './types';

const gptGenClient = {
  genPrompts: (options: ResponseGenRequest): Promise<ResponseGenResponse> => mlService.post<ResponseGenResponse>('v1/generation/prompt', options),

  genUtterances: (options: UtteranceGenRequest): Promise<UtteranceGenResponse> =>
    mlService.post<UtteranceGenResponse>('v1/generation/utterance', options),

  genEntityValues: (options: EntityValuesGenRequest): Promise<EntityValuesGenResponse> =>
    mlService.post<EntityValuesGenResponse>('v1/generation/entity-values', options),

  genEntityPrompts: (options: EntityPromptGenRequest): Promise<EntityPromptGenResponse> =>
    mlService.post<EntityPromptGenResponse>('v1/generation/entity-prompt', options),

  generativeResponse: ({ prompt, maxTokens, system, model, temperature }: GenerativeResponseRequest): Promise<GenerativeResponseResponse> =>
    mlService.post<any>('v1/generation/generative-response', { prompt, maxTokens, system, model, temperature }),
};

export default gptGenClient;
