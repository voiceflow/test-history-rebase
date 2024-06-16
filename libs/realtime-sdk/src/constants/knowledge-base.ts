import { AIModel, KBSettingsChunkStrategy, KBSettingsPromptMode, KnowledgeBaseSettings } from '@voiceflow/dtos';

export const KB_SETTINGS_DEFAULT: KnowledgeBaseSettings = {
  summarization: {
    prompt: '',
    mode: KBSettingsPromptMode.PROMPT,
    model: AIModel.GPT_3_5_TURBO,
    temperature: 0.1,
    system:
      "You are an FAQ AI chat assistant. Information will be provided to help answer the user's questions. Always summarize your response to be as brief as possible and be extremely concise. Your responses should be fewer than a couple of sentences.",
  },
  chunkStrategy: {
    type: KBSettingsChunkStrategy.RECURSIVE_TEXT_SPLITTER,
    size: 1200,
    overlap: 200,
  },
  search: {
    limit: 3,
    metric: 'IP',
  },
};

export const KB_SETTINGS_NEW_EMBEDDING_MODEL = {
  model: 'text-embedding-3-large',
  size: 1024,
};
