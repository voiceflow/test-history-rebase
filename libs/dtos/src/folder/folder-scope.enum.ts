export const FolderScope = {
  ENTITY: 'entity',
  EVENT: 'event',
  FLOW: 'flow',
  FUNCTION: 'function',
  INTENT: 'intent',
  PROMPT: 'prompt',
  PERSONA: 'persona',
  RESPONSE: 'response',
  STORY: 'story',
  VARIABLE: 'variable',
  KNOWLEDGE_BASE: 'knowledge-base',
} as const;

export type FolderScope = (typeof FolderScope)[keyof typeof FolderScope];
