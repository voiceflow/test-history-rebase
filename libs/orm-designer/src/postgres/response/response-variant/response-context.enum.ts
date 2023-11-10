export const ResponseContext = {
  PROMPT: 'prompt',
  MEMORY: 'memory',
  KNOWLEDGE_BASE: 'knowledge_base',
} as const;

export type ResponseContext = (typeof ResponseContext)[keyof typeof ResponseContext];
