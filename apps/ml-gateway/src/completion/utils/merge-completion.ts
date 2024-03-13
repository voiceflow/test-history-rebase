import { CompletionResponse } from '../dtos/completion.response';

export async function merge<T extends CompletionResponse>(asyncCollection: () => AsyncIterableIterator<T>): Promise<CompletionResponse> {
  const response: CompletionResponse = {
    model: '',
    output: '',
    answerTokens: 0,
    multiplier: 0,
    queryTokens: 0,
    tokens: 0,
    error: null,
  };

  for await (const chunk of asyncCollection()) {
    if (chunk.output) response.output += chunk.output;
    if (chunk.tokens) response.tokens += chunk.tokens;
    if (chunk.queryTokens) response.queryTokens += chunk.queryTokens;
    if (chunk.answerTokens) response.answerTokens += chunk.answerTokens;

    if (chunk.multiplier) response.multiplier = chunk.multiplier;
    if (chunk.model) response.model = chunk.model;
    if (chunk.error) response.error = chunk.error;
  }

  return response as CompletionResponse;
}
