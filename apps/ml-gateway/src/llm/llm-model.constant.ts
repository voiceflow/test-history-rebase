import type { CompletionOutput } from './llm-model.dto';

export const EmptyCompletionOutput = (params?: Partial<CompletionOutput>): CompletionOutput => ({
  output: null,
  tokens: 0,
  queryTokens: 0,
  answerTokens: 0,
  multiplier: 0,
  model: '',

  ...params,
});
