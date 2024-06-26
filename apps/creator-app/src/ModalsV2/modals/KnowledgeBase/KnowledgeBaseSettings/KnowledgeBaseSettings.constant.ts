import { BaseModels, BaseUtils } from '@voiceflow/base-types';

export const DEFAULT_SETTINGS = {
  search: {
    limit: 3,
    metric: 'IP',
  },

  chunkStrategy: {
    type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER,
    size: 1200,
    overlap: 200,
  },

  summarization: {
    mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
    model: BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo,
    prompt: '',
    maxTokens: 128,
    temperature: 0.1,
    instruction: '',
    system:
      "You are an FAQ AI chat agent. Information will be provided to help answer the user's questions. Always summarize your response to be as brief as possible and be extremely concise. Your responses should be fewer than a couple of sentences.",
  },
} satisfies BaseModels.Project.KnowledgeBaseSettings;
