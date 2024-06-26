import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { DEFAULT_AI_MODEL, KBSettingsChunkStrategy, KBSettingsPromptMode } from '@voiceflow/dtos';

export const KB_SETTINGS_DEFAULT = {
  summarization: {
    prompt: '',
    mode: KBSettingsPromptMode.PROMPT,
    model: DEFAULT_AI_MODEL,
    maxTokens: 128,
    temperature: 0.1,
    system:
      "You are an FAQ AI chat agent. Information will be provided to help answer the user's questions. Always summarize your response to be as brief as possible and be extremely concise. Your responses should be fewer than a couple of sentences.",
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
} satisfies KnowledgeBaseSettings;

export const KB_SETTINGS_NEW_EMBEDDING_MODEL = {
  model: 'text-embedding-3-large',
  size: 1024,
};
